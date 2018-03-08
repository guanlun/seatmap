import React from 'react';
import fetch from 'node-fetch';
import { request } from './Utils';

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

        request({
            endpoint: 'studentLogin',
            method: 'POST',
            payload: {
                username: this.username,
                password: this.password,
            },
        }).then((resData, err) => {
            if (err) {
                console.log('login failed')
            } else {
                document.cookie = `userId=${resData.user._id}`;
                document.cookie = `userToken=${resData.user.token}`;
                window.location = '/student';
            }
        })
    }
};

