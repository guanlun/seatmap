import React from 'react';
import fetch from 'node-fetch';
import { request } from './Utils';

export default class StudentLogin extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <form onSubmit={this.login.bind(this)}>
                    <input ref='usernameInput' type='text' onChange={e => this.username = e.target.value} placeholder='username' value='test_0' />
                    <input ref='passwordInput' type='password' onChange={e => this.password = e.target.value} placeholder='password' value='test_0' />
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
                username: this.refs.usernameInput.value,
                password: this.refs.passwordInput.value,
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

