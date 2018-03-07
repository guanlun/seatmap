const MongoClient = require('mongodb').MongoClient;

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

MongoClient.connect('mongodb://localhost:27017/', (err, client) => {
    const db = client.db('seatmap');
    const seatCollection = db.collection('seats');

    seatCollection.insertMany(seats);
})