const SERVER_ADDR = 'http://localhost:3001';

export function request({ endpoint, method = 'GET', payload = {} }) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, `${SERVER_ADDR}/${endpoint}`, true);
        xhr.withCredentials = true;
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(xhr.status);
                }
            }
        };

        xhr.send(JSON.stringify(payload));
    });
}

export const seatTemplates = {
    rows: [],
    circle: [],
    tables: [],
};

export function generateRowSeatmap(height, width) {
    const seats = [];
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            seats.push({
                id: seats.length,
                x: 100 + 150 * i,
                y: 100 + 100 * j,
                rotation: 0,
            });
        }
    }

    return seats;
}


const numSeatsInCircle = 15;
for (let i = 0; i < numSeatsInCircle; i++) {
    const rad = i / numSeatsInCircle * Math.PI * 2;

    const center = {
        x: 400,
        y: 400,
    };

    const radius = 300;

    seatTemplates.circle.push({
        id: seatTemplates.circle.length,
        x: center.x + radius * Math.sin(rad),
        y: center.y - radius * Math.cos(rad),
        rotation: rad * 180 / Math.PI,
    });
}
