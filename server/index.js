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

function randArrayOfValues(length, values) {
    const arr = [];
    const vCount = values.length;
    for (let i = 0; i < length; i++) {
        arr.push(values[Math.floor(Math.random() * vCount)]);
    }

    return arr;
}

function generateRandomStudentPerformance() {
    return {
        attendance: randArrayOfValues(10, [true, false]),
    }
}

let seats = [];

let studentGeneratorInterval = null;

let students = [];

function generateStudent(ws) {
    if (students.length === seats.length) {
        clearInterval(studentGeneratorInterval);
        return;
    }

    const student = {
        id: students.length,
        name: dummyNames[students.length],
        seatId: seats[students.length].id,
        performance: generateRandomStudentPerformance(),
    };

    students.push(student);

    ws.send(JSON.stringify(student));
}

let mongodb = null;

MongoClient.connect('mongodb://localhost:27017/', (err, client) => {
    mongodb = client.db('seatmap');
    const seatCollection = mongodb.collection('seats');

    seatCollection.find({}).toArray((err, docs) => {
        seats = docs;
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
                        resolve(token);
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

    loginUser(reqData.username, reqData.password).then((token, err) => {
        if (token) {
            res.send(JSON.stringify({
                success: true,
                token,
            }));
        } else {
            res.send(JSON.stringify({
                success: false,
                err,
            }));
        }
    });
});

app.listen(3001, () => console.log('Example app listening on port 3001!'));

ws.on('connection', socket => {
    console.log('connected!!!');

    students = [];
    studentGeneratorInterval = setInterval(() => generateStudent(socket), 500);

    socket.on('close', () => {
        console.log('websocket closed');
    });

    socket.on('error', () => {
        students = [];
        clearInterval(studentGeneratorInterval);
        console.log('websocket error');
    });
});
