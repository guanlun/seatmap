import React from 'react';
import { Chart } from 'chart.js';

const backgroundColor = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
];

const borderColor = [
    'rgba(255,99,132,1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
];

function aggregateCount(dataArr) {
    const dataMap = {};

    for (const item of dataArr) {
        if (dataMap[item]) {
            dataMap[item]++;
        } else {
            dataMap[item] = 1;
        }
    }

    return {
        labels: Object.keys(dataMap),
        data: Object.keys(dataMap).map(k => dataMap[k]),
    };
}

export default class StudentInfoCharts extends React.Component {
    componentDidMount() {
        this.canvas = this.refs.chartCanvas;
        this.ctx = this.canvas.getContext('2d');

        this.pieChart = new Chart(this.ctx, {
            type: 'pie',
            data: {
                labels: [],//chartData.labels,//["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [{
                    label: 'label',
                    data: [],//chartData.data,
                    backgroundColor,
                    borderColor,
                    borderWidth: 1
                }]
            },
            options: {
                events: ['click'],
                animation: false,
                responsive: false,
                onClick: (evt, chartElement) => {
                }
            }
        });
    }

    updateChart(chartData) {
        this.pieChart.data.labels = chartData.labels;
        this.pieChart.data.datasets[0].data = chartData.data;
        this.pieChart.update();
    }

    componentWillReceiveProps(nextProps) {
        const topicDataSet = aggregateCount(nextProps.students.map(s => s.storyTopic));
        this.updateChart(topicDataSet);
    }

    render() {
        return (
            <canvas ref="chartCanvas" width="300" height="300"></canvas>
        )
    }
}