const express = require('express');
const WebSocket = require('ws');
const mongo = require('mongodb');
const bodyParser = require('body-parser');
const shajs = require('sha.js');
const cookieParser = require('cookie-parser');
const keywordExtractor = require('keyword-extractor');
const stopwords = [ "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves" ];
const WordPOS = require('wordpos');
const MongoClient = mongo.MongoClient;

const app = express();
const ws = new WebSocket.Server({ port: 3002 });

let seats = [];

let studentGeneratorInterval = null;

let students = [];

let webSocket = null;

let mockStudentIndex = 0;

const wordPos = new WordPOS();

function mockStudentLogin(ws) {
    console.log(mockStudentIndex)
    if (mockStudentIndex === students.length) {
        clearInterval(studentGeneratorInterval);
        return;
    }

    ws.send(JSON.stringify(students[mockStudentIndex]));

    mockStudentIndex++;
}

let mongodb = null;

MongoClient.connect('mongodb://localhost:27017/', (err, client) => {
    mongodb = client.db('seatmap');

    const seatCollection = mongodb.collection('seats');
    seatCollection.find({}).toArray((err, docs) => {
        seats = docs;
    });

    const studentCollection = mongodb.collection('students');
    studentCollection.find({}).toArray((err, docs) => {
        students = docs;
    });
})

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

app.use(bodyParser.text());
app.use(cookieParser());

app.get('/seats/', (req, res) => {
    res.send(JSON.stringify(seats));
});

app.get('/students/', (req, res) => {
    res.send(JSON.stringify(students));
});

function loginUser(username, password) {
    return new Promise((resolve, reject) => {
        mongodb.collection('students').find({ username }).toArray((err, docs) => {
            if (docs.length !== 1) {
                reject('username not found');
            }

            const user = docs[0];

            if (user.password === password) {
                const token = generateUserToken();

                mongodb.collection('students').updateOne({ username }, {
                    $set: {
                        token,
                    }
                }, (err, result) => {
                    if (result) {
                        user.token = token;
                        resolve(user);
                    } else {
                        reject('login failed: server error');
                    }
                });
            } else {
                reject('wrong password');
            }
        })
    });
}

function generateUserToken() {
    const dict = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const token = [];
    for (let i = 0; i < 30; i++) {
        token.push(dict.charAt(Math.floor(Math.random() * dict.length)));
    }

    return token.join('');
}

app.post('/studentLogin', (req, res) => {
    const reqData = JSON.parse(req.body);

    loginUser(reqData.username, reqData.password).then((user, err) => {
        if (user) {
            res.send(JSON.stringify({
                success: true,
                user,
            }));
        } else {
            res.send(JSON.stringify({
                success: false,
                err,
            }));
        }
    });
});

function textToWords(text) {
    return text.toLowerCase().split(' ').map(w => w.replace(/\W+/, '')).filter(w => stopwords.indexOf(w) === -1);
}

function wordTfIdf(word, text, wordCollections) {
    const numCollections = wordCollections.length;

    let termCount = 0;
    for (const w of text) {
        if (word === w) {
            termCount++;
        }
    }

    let docCount = 0;
    for (const c of wordCollections) {
        if (c.indexOf(word) !== -1) {
            docCount++;
        }
    }

    const tf = Math.log(1 + termCount / text.length);
    // const idf = Math.log(numCollections / docCount);

    return tf;
}

function extractKeywords() {
    mongodb.collection('students').find({}).toArray((err, students) => {
        const allHomeworks = students.map(s => s.homeworks);
        const wordCollections = allHomeworks.reduce((a, b) => a.concat(b)).map(h => textToWords(h.writing));

        const tfidfLookup = {};

        for (const text of wordCollections) {
            const countedWords = {};

            for (const word of text) {
                if (countedWords[word] === undefined) {
                    const tfidf = wordTfIdf(word, text, wordCollections);
                    countedWords[word] = true;

                    if (tfidfLookup[word] === undefined) {
                        tfidfLookup[word] = tfidf;
                    } else {
                        tfidfLookup[word] += tfidf;
                    }
                }
            }
        }

        const tfidfPairs = Object.keys(tfidfLookup).map(k => ({ term: k, val: tfidfLookup[k] })).sort((a, b) => a.val - b.val);
        const keywords = tfidfPairs.map(p => p.term);

        wordPos.getNouns(keywords.join(' '), nounKeywords => {
            wordPos.getVerbs(keywords.join(' '), verbKeywords => {
                for (const verb of verbKeywords) {
                    const vIndex = nounKeywords.indexOf(verb);
                    nounKeywords.splice(vIndex, 1);
                }

                mongodb.collection('keywords').update({}, {
                    $set: {
                        keywords: nounKeywords,
                    },
                });
            })
        });
    });
}

app.post('/submitWriting', (req, res) => {
    const reqData = req.body;
    const writingData = JSON.parse(reqData);
    const { userId, userToken } = req.cookies;

    mongodb.collection('students').find(mongo.ObjectId(userId)).toArray((err, docs) => {
        if (docs.length !== 1) {
            res.send(JSON.stringify({ success: false }));
            return;
        }

        const student = docs[0];

        if (student.token !== userToken) {
            res.send(JSON.stringify({ success: false }));
            return;
        }

        // extractKeywords();

        const keywords = keywordExtractor.extract(writingData.writing, { language: 'english', remove_duplicates: true });

        wordPos.getNouns(keywords.join(' '), nounKeywords => {
            // TODO: filter out verb keywords
            writing.keywords = nounKeywords;

            mongodb.collection('students').updateOne({ _id: mongo.ObjectId(userId) }, {
                $push: {
                    homeworks: writingData,
                },
            }, (err, result) => {
                if (result) {
                    res.send(JSON.stringify({
                        success: true,
                    }));
                } else {
                    res.send(JSON.stringify({ success: false }));
                }
            });
        });
    });
});

app.get('/studentInfo', (req, res) => {
    const reqData = req.body;

    res.send(JSON.stringify({
        success: true,
    }));
});

app.get('/keywords', (req, res) => {
    mongodb.collection('keywords').find({}).toArray((err, docs) => {
        if (docs.length !== 1) {
            res.send(JSON.stringify({
                success: false,
            }));
        }

        res.send(JSON.stringify(docs[0].keywords));
    });
});

app.get('/getSeatmaps', (req, res) => {
    const seatmapsCollection = mongodb.collection('seatmaps');
    seatmapsCollection.find({}).toArray((err, docs) => {
        res.send(JSON.stringify(docs));
    });
});

app.post('/saveSeatmap', (req, res) => {
    const seatmap = JSON.parse(req.body);
    const seatmapsCollection = mongodb.collection('seatmaps');
    seatmapsCollection.find({ name: seatmap.name }).toArray((err, docs) => {
        if (docs.length === 0) {
            seatmapsCollection.insert(seatmap);
        } else if (docs.length === 1) {
            seatmapsCollection.update({ name: seatmap.name }, {
                $set: {
                    seats: seatmap.seats,
                },
            });
        }
    });
    // seatmapsCollection.insert(seatmap);

    res.send(JSON.stringify({ status: 'ok' }));
});

app.get('/beginMockingStudents', (req, res) => {
    if (!webSocket || mockStudentIndex !== 0) {
        res.send(JSON.stringify({
            success: false,
        }));
        return;
    }

    console.log('connected!!!');

    mockStudentIndex = 0;

    studentGeneratorInterval = setInterval(() => mockStudentLogin(webSocket), 500);

    res.send(JSON.stringify({
        success: true,
    }));
});

app.listen(3001, () => console.log('Listening on port 3001!'));

ws.on('connection', socket => {
    webSocket = socket;

    webSocket.on('close', () => {
        console.log('websocket closed');
    });

    webSocket.on('error', () => {
        mockStudentIndex = 0;
        clearInterval(studentGeneratorInterval);
        console.log('websocket error');
    });

});
