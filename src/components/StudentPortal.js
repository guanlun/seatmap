import React from 'react';
import { request } from './Utils';
import WritingSubmission from './WritingSubmission';

function getCookieByName(name) {
    for (const pair of document.cookie.split(';')) {
        const parts = pair.trim().split('=');

        if (parts[0] === name) {
            return parts[1];
        }
    }
}

export default class StudentPortal extends React.Component {
    componentDidMount() {
        this.userId = getCookieByName('userId');

        if (!this.userId) {
            window.location = '/studentlogin';
            return;
        }
    }

    getStudentInfo(userId) {
        request({
            endpoint: 'studentInfo',
            payload: { userId },
        }).then((resData, err) => {
            console.log(resData)
        });
    }

    render() {
        return (
            <div>
                <WritingSubmission />
            </div>
        );
    }
};

