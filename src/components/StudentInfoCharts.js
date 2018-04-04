import React from 'react';
import { Chart } from 'chart.js';
import { CHART_TYPE } from '../constants';

const colors = [
    [ 255, 99, 132 ],
    [ 54, 162, 235 ],
    [ 255, 206, 86 ],
    [ 75, 192, 192 ],
    [ 153, 102, 255 ],
    [ 255, 159, 64 ],
];

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

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

        const chartColors = shuffle(colors);

        const backgroundColor = chartColors.map(c => `rgba(${c.join(',')},0.2)`);
        const borderColor = chartColors.map(c => `rgb(${c.join(',')})`);

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
                title: {
                    display: true,
                    fontSize: 16,
                    text: chartType,
                },
                legend: {
                    position: 'right',
                },
                events: ['click'],
                animation: false,
                responsive: false,
                onClick: (evt, chartElements, chart) => {
                    if (chartElements.length !== 1) {
                        return;
                    }

                    const labels = chartElements[0]._chart.data.labels;
                    const chartIndex = chartElements[0]._index;

                    onAreaSelect(chartType, labels[chartIndex], borderColor[chartIndex]);
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
                <canvas ref="topicDataCanvas" width="400" height="300"></canvas>
                <canvas ref="contextDataCanvas" width="400" height="300"></canvas>
            </div>
        );
    }
}