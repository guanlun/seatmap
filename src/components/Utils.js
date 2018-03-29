const SERVER_ADDR = 'http://10.230.161.231:3001';

export function request({ endpoint, method = 'GET', payload = {} }) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, `${SERVER_ADDR}/${endpoint}`, true);
        xhr.withCredentials = true;
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                resolve(JSON.parse(xhr.responseText));
            }
        };

        xhr.send(JSON.stringify(payload));
    });
}