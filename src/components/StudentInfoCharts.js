import React from 'react';
import { Chart } from 'chart.js';
import { CHART_TYPE } from '../constants';

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
        this.topicChart = this.createPieChart(CHART_TYPE.TOPIC, this.refs.topicDataCanvas);
        this.contextChart = this.createPieChart(CHART_TYPE.CONTEXT, this.refs.contextDataCanvas);
    }

    createPieChart(chartType, canvas) {
        const { onAreaSelect } = this.props;

        const ctx = canvas.getContext('2d');
        return new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    label: 'label',
                    data: [],
                    backgroundColor,
                    borderColor,
                    borderWidth: 1
                }]
            },
            options: {
                events: ['click'],
                responsive: false,
                onClick: (evt, chartElements, chart) => {
                    // const chart = chartElements[0].
                    const labels = chartElements[0]._chart.data.labels;
                    const chartIndex = chartElements[0]._index;

                    onAreaSelect(chartType, labels[chartIndex]);
                }
            }
        });
    }

    updateChart(chart, chartData) {
        chart.data.labels = chartData.labels;
        chart.data.datasets[0].data = chartData.data;
        chart.update();
    }

    componentWillReceiveProps(nextProps) {
        const topicDataSet = aggregateCount(nextProps.students.map(s => s.storyTopic));
        const contextDataSet = aggregateCount(nextProps.students.map(s => s.storyContext));
        this.updateChart(this.topicChart, topicDataSet);
        this.updateChart(this.contextChart, contextDataSet);
    }

    render() {
        return (
            <div className="student-info-chart-container">
                <canvas ref="topicDataCanvas" width="300" height="300"></canvas>
                <canvas ref="contextDataCanvas" width="300" height="300"></canvas>
            </div>
        );
    }
}