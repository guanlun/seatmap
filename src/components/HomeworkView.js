import React from 'react';
import { Chart } from 'chart.js';
import FaCheckSquareO from 'react-icons/lib/fa/check-square-o';

export default class HomeworkView extends React.Component {
    componentDidMount() {
        const { grades } = this.props;

        const labels = [];
        for (let i = 1; i <= grades.length; i++) {
            labels.push(i);
        }

        const ctx = this.refs.gradeCanvas.getContext('2d');
        this.gradeChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Grades',
                    data: grades,
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.2)',
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                legend: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        this.gradeChart.data.datasets[0].data = nextProps.grades;
        this.gradeChart.update();
    }

    render() {
        return (
            <div className="homework-grade-container">
                <div className='attendance-view student-detail-header'>
                    <FaCheckSquareO size={32} />
                    <span>Grades:</span>
                </div>
                <canvas ref="gradeCanvas" width="400" height="200"></canvas>
            </div>
        );
    }
};
