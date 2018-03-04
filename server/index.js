const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();

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

const students = [];
let studentIdx = 0;
for (const seat of seats) {
    students.push({
        id: studentIdx,
        name: dummyNames[studentIdx],
        seat,
    });

    studentIdx++;
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
