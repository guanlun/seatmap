import React from 'react';
import fetch from 'node-fetch';

export default class StudentLogin extends React.Component {
    constructor() {
        super();
        this.username = 'test';
        this.password = 'test';
    }

    render() {
        return (
            <div>
                <form onSubmit={this.login.bind(this)}>
                    <input type='text' onChange={e => this.username = e.target.value} placeholder='username' />
                    <input type='password' onChange={e => this.password = e.target.value} placeholder='password' />
                    <input type='submit' />
                </form>
            </div>
        );
    }

    login(evt) {
        evt.preventDefault();
        
        // fetch('http://127.0.0.1:3001/studentLogin', {
        //     method: 'POST',
        //     body: JSON.stringify({
        //         username: this.username,
        //         password: this.password,
        //     }),
        // })
        // .then(res => res.text())
        // .then(body => {
        //     const resData = JSON.parse(body);
        //     // console.log(resData)
        //     document.cookie = `userToken=${resData.token}`;
        //     console.log(document.cookie)
        // });

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3001/studentLogin', true);
        xhr.withCredentials = true;
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                const resData = JSON.parse(xhr.responseText);
                if (resData.success) {
                    document.cookie = `userToken=${resData.token}`;
                    window.location = '/student';
                }
            }
        };
        xhr.send(JSON.stringify({
            username: this.username,
            password: this.password,
        }));
    }
};

