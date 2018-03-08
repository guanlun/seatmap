const express = require('express');
const WebSocket = require('ws');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const shajs = require('sha.js');
const cookieParser = require('cookie-parser');

const app = express();
const ws = new WebSocket.Server({ port: 3002 });

const dummyNames = [
    'Fabian Button',
    'Ami Branner',
    'Lashaun Trostle',
    'Nolan Coppock',
    'Jaimee Averitt',
    'Bianca Blossom',
    'Tarsha Foutch',
    'Cathi Hensler',
    'Alia Dupont',
    'Gaynell Rueter',
    'Maribel Redington',
    'Hwa Coakley',
    'Ofelia Lakes',
    'Ellie Bernhard',
    'Johana Minelli',
    'Jae Eggert',
    'Deedra Hoehne',
    'Harris Canady',
    'Reginald Starks',
    'Despina Zollinger',
];

let seats = [];

let studentGeneratorInterval = null;

let students = [];

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

// app.use(cors());
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
        mongodb.collection('users').find({ username }).toArray((err, docs) => {
            if (docs.length !== 1) {
                reject('username not found');
            }

            const user = docs[0];

            if (user.password === password) {
                const token = generateUserToken();

                mongodb.collection('users').updateOne({ username }, {
                    $set: {
                        token,
                    }
                }, (err, res) => {
                    if (res) {
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
    console.log(req.cookies)

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

app.get('/studentInfo', (req, res) => {
    const reqData = req.body;
    console.log(req.cookies)

    res.send(JSON.stringify({
        success: true,
    }));
});

app.listen(3001, () => console.log('Listening on port 3001!'));

ws.on('connection', socket => {
    console.log('connected!!!');

    mockStudentIndex = 0;

    studentGeneratorInterval = setInterval(() => mockStudentLogin(socket), 500);

    socket.on('close', () => {
        console.log('websocket closed');
    });

    socket.on('error', () => {
        mockStudentIndex = 0;
        clearInterval(studentGeneratorInterval);
        console.log('websocket error');
    });
});
