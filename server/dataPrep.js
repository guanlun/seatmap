const MongoClient = require('mongodb').MongoClient;

const DUMMY_NAMES = [
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

const DUMMY_TOPICS = [
    'Foodwebs',
    'Adaptation',
    'CO2',
    'Inherited traits',
];

const DUMMY_CONTEXT = [
    'Home',
    'Museum',
    'Park',
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

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

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

function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const shuffledSeats = shuffle(seats);
const students = [];
for (let i = 0; i < 12; i++) {
    students.push({
        username: `test_${i}`,
        password: `test_${i}`,
        name: DUMMY_NAMES[i],
        performance: generateRandomStudentPerformance(),
        seatId: shuffledSeats[i].id,
        storyTopic: randomItem(DUMMY_TOPICS),
        storyContext: randomItem(DUMMY_CONTEXT),
    });
}

MongoClient.connect('mongodb://localhost:27017/', (err, client) => {
    const db = client.db('seatmap');
    const seatCollection = db.collection('seats');
    seatCollection.remove({});
    seatCollection.insertMany(seats);

    const studentCollection = db.collection('students');
    studentCollection.remove({});
    studentCollection.insertMany(students);
})