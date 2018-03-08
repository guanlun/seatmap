import React from 'react';
import * as d3 from 'd3';

const dataset = [
    { label: 'Abulia', count: 10 },
    { label: 'Betelgeuse', count: 20 },
    { label: 'Cantaloupe', count: 30 },
    { label: 'Dijkstra', count: 40 }
];

const color = d3.scaleOrdinal(d3.schemeCategory20b);

const CHART_WIDTH = 900;
const CHART_HEIGHT = 300;
const CHART_RADIUS = 100;

function aggregateCount(dataArr) {
    const dataMap = {};

    for (const item of dataArr) {
        if (dataMap[item]) {
            dataMap[item]++;
        } else {
            dataMap[item] = 1;
        }
    }

    return Object.keys(dataMap).map(key => { 
        return { label: key, count: dataMap[key] };
    });
}

function updateChart(dataset, plotArea) {
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(CHART_RADIUS);

    const pie = d3.pie()
        .value(d => d.count)
        .sort(null);

    const path = plotArea.selectAll('path')
        .data(pie(dataset))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', (d, i) => color(d.data.label))
        .on('mouseover', d => {
            console.log(d, d.label);
    });
}

// TODO: make a StudentInfoChartContainer redux logic?
export default class StudentInfoCharts extends React.Component {
    componentDidMount() {
        this.chart = d3.select(this.refs.chart)
            .append('svg')
            .attr('width', CHART_WIDTH)
            .attr('height', CHART_HEIGHT);
            
        this.chart.plotArea1 = this.chart.append("g")
            .attr('transform', 'translate(' + (CHART_WIDTH / 2 - 300) +  ',' + (CHART_HEIGHT / 2) + ')');
        this.chart.plotArea2 = this.chart.append("g")
            .attr('transform', 'translate(' + (CHART_WIDTH / 2) +  ',' + (CHART_HEIGHT / 2) + ')');
    }

    componentWillReceiveProps(nextProps) {
        const topicDataSet = aggregateCount(nextProps.students.map(s => s.storyTopic));
        const contextDataSet = aggregateCount(nextProps.students.map(s => s.storyContext));

        updateChart(topicDataSet, this.chart.plotArea1);
        updateChart(contextDataSet, this.chart.plotArea2);
    }

    render() {
        return (
            <div ref='chart' className='student-info-charts'>
            </div>
        );
    }
}