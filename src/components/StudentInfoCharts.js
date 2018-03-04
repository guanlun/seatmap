import React from 'react';
import * as d3 from 'd3';

const  dataset = [
    { label: 'Abulia', count: 10 },
    { label: 'Betelgeuse', count: 20 },
    { label: 'Cantaloupe', count: 30 },
    { label: 'Dijkstra', count: 40 }
];

const color = d3.scaleOrdinal(d3.schemeCategory20b);

const CHART_WIDTH = 300;
const CHART_HEIGHT = 300;
const CHART_RADIUS = 100;

// TODO: make a StudentInfoChartContainer redux logic?
export default class StudentInfoCharts extends React.Component {
    componentDidMount() {
        this.chart = d3.select(this.refs.chart)
            .append('svg')
            .attr('width', CHART_WIDTH)
            .attr('height', CHART_HEIGHT);
            
        this.chart.plotArea = this.chart.append("g")
            .attr('transform', 'translate(' + (CHART_WIDTH / 2) +  ',' + (CHART_HEIGHT / 2) + ')');

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(CHART_RADIUS);

        const pie = d3.pie()
            .value(function(d) { return d.count; })
            .sort(null);

        const path = this.chart.plotArea.selectAll('path')
            .data(pie(dataset))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function(d, i) {
              return color(d.data.label);
            });
    }

    render() {
        return (
            <div ref='chart' className='student-info-charts'>
            </div>
        );
    }
}