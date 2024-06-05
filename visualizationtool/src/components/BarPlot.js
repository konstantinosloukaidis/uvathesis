import React, { useEffect } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { firstLetterUppercase } from '../utils/helpers';

const BarPlot = ({ data }) => {

    function createBarPlot(data) {
        const barData = Object.keys(data).filter(key => key !== 'total').map(key => ({
            data_group: key,
            count: data[key]
        }));

        d3.select("#my_dataviz svg").remove();
        const margin = { top: 20, right: 20, bottom: 60, left: 50 },
            width = 600 - margin.left - margin.right,
            height = 480 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        const svg = d3.select("#my_dataviz")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // X axis
        const xAxisLabels = ['coverage', 'trip frequency', 'comfort', 'sustainability', 'equipment', 'pricing']
        var x = d3.scaleBand()
            .range([0, width])
            .domain(xAxisLabels)
            .padding(0.2);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickFormat(d => firstLetterUppercase(d)))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, data['total']])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Bars
        svg.selectAll("mybar")
            .data(barData)
            .enter()
            .append("rect")
            .attr("x", function (d) { return x(d.data_group); })
            .attr("y", function (d) { return y(d.count); })
            .attr("width", x.bandwidth())
            .attr("height", function (d) { return height - y(d.count); })
            .attr("fill", "#69b3a2")
    }

    useEffect(() => {
        createBarPlot(data);
    }, [data]);

    return <div id="my_dataviz"></div>;
};

BarPlot.propTypes = {
    data: PropTypes.object
};

export default BarPlot;
