import React from 'react';
import { request } from './Utils';

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
        const userId = getCookieByName('userId');

        if (!userId) {
            window.location = '/studentlogin';
            return;
        }
        this.getStudentInfo(userId);
        
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
                student portal
            </div>
        );
    }
};

