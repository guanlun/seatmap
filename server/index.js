const express = require('express');
const WebSocket = require('ws');
const MongoClient = require('mongodb').MongoClient;

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

const seats = [];
let seatIdx = 0;
for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 3; y++) {
        seats.push({
            id: seatIdx,
            position: {
                x: 20 + x * 150,
                y: 20 + y * 80,
            },
        });
        seatIdx++;
    }
}

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

// MongoClient.connect('mongodb://localhost:27017/', (err, db) => {
// })

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    next();
});

app.get('/seats/', (req, res) => {
    res.send(JSON.stringify(seats));
});

app.get('/students/', (req, res) => {
    res.send(JSON.stringify(students));
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
