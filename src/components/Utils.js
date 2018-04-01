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

for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 3; j++) {
        seatTemplates.rows.push({
            id: seatTemplates.rows.length,
            x: 20 + 150 * i,
            y: 20 + 100 * j,
            rotation: 0,
        });
    }
}
