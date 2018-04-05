const express = require('express');
const WebSocket = require('ws');
const mongo = require('mongodb');
const bodyParser = require('body-parser');
const shajs = require('sha.js');
const cookieParser = require('cookie-parser');
const keywordExtractor = require('keyword-extractor');

const MongoClient = mongo.MongoClient;

const app = express();
const ws = new WebSocket.Server({ port: 3002 });

let seats = [];

let studentGeneratorInterval = null;

let students = [];

let webSocket = null;

let mockStudentIndex = 0;

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

        writingData.keywords = keywordExtractor.extract(writingData.writing, { language: 'english', remove_duplicates: true });

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

app.get('/studentInfo', (req, res) => {
    const reqData = req.body;

    res.send(JSON.stringify({
        success: true,
    }));
});

app.get('/keywords', (req, res) => {
    const texts = students.map(s => s.storyText);

    const allText = texts.join(' ');

    const keywords = keywordExtractor.extract(allText, { language: 'english', remove_duplicates: true });
    console.log(keywords)

    res.send('ok');
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
