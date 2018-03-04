const express = require('express');
const app = express();

const dummyStudentData = [
    {
        id: 1,
        name: 'Hella Tria',
        perf: 50,
    }, 
    {
        id: 2,
        name: 'Erle Passang',
        perf: 60,
    }, 
    {
        id: 3,
        name: 'Monica Luben',
        perf: 70,
    }, 
    {
        id: 4,
        name: 'Amaka Jana',
        perf: 80,
    }, 
];

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    next();
});

app.get('/', (req, res) => {
    res.send(JSON.stringify(dummyStudentData));
});

app.listen(3001, () => console.log('Example app listening on port 3001!'));
