import React, { useEffect } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { FIVE_STAR_RATING_METRICS, PERCENTAGE_METRICS, BUBBLE_PLOT_COLOUR_SCHEME } from '../utils/constants';
import { firstLetterUppercase, bubblePlotTransform } from '../utils/helpers';

const BubblePlot = ({ data, xAxisVariable, yAxisVariable, zAxisVariables }) => {

    function createBubblePlot(data, xAxisVariable, yAxisVariable, zAxisVariables) {
        d3.select("#my_dataviz svg").remove();
        const margin = {top: 20, right: 20, bottom: 50, left: 50},
            width = 600 - margin.left - margin.right,
            height = 480 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        const svg = d3.select("#my_dataviz")
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);
    
        let xDomain, yDomain, xTicks, yTicks;
        if (PERCENTAGE_METRICS.includes(xAxisVariable)) {
            xDomain = [0, 100];
            xTicks = 10;
        } else if (FIVE_STAR_RATING_METRICS.includes(xAxisVariable)){
            xDomain = [1, 5]
            xTicks = 5;
        }
    
        if (PERCENTAGE_METRICS.includes(yAxisVariable)) {
            yDomain = [0, 100];
            yTicks = 10;
        } else if (FIVE_STAR_RATING_METRICS.includes(yAxisVariable)){
            yDomain = [0, 5];
            yTicks = 5;
        }

        const x = d3.scaleLinear()
            .domain(xDomain)
            .range([0, width]);
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x).ticks(xTicks));
    
        const y = d3.scaleLinear()
            .domain(yDomain)
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y).ticks(yTicks));

        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", width/2 + margin.left)
            .attr("y", height + margin.top + 20)
            .text(firstLetterUppercase(xAxisVariable));
      
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 20)
            .attr("x", -margin.top - height/2 + 20)
            .text(firstLetterUppercase(yAxisVariable))

        const z = d3.scaleLinear()
            .domain([0, 5])
            .range([4, 20]);

        const tooltip = d3.select("#my_dataviz")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "black")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("color", "white")
            .style("position", "absolute")
        ;

        const showTooltip = function(event, d) {
            tooltip
              .transition()
              .duration(200)
            tooltip
              .style("opacity", 1)
              .html(d.file + " - " + firstLetterUppercase(d.zMetric) + " - " + (PERCENTAGE_METRICS.includes(d.zMetric) ? ((d.zValue/5)*100).toFixed(2) + "%" : d.zValue + " stars"))
              .style("left", (event.pageX)/2 + "px")
              .style("top", (event.pageY)/2 + "px")
          }

        const moveTooltip = function(event, d) {
            tooltip
              .style("left", (event.pageX)/2 + "px")
              .style("top", (event.pageY)/2 + "px")
          }
        
        const hideTooltip = function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0);
        };

        svg.append('g')
        .attr('class', 'x axis-grid')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x).tickSize(-height).tickFormat('').ticks(xTicks*2));

        svg.append('g')
            .attr('class', 'y axis-grid')
            .call(d3.axisLeft(y).tickSize(-width).tickFormat('').ticks(yTicks*2));

        const myColor = d3.scaleOrdinal()
            .domain(zAxisVariables)
            .range(BUBBLE_PLOT_COLOUR_SCHEME);
    
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .join("circle")
                .attr("class", "bubbles")
                .attr("cx", (d) => {
                    if (["consistency", "completeness"].includes(xAxisVariable)){
                        return x(d.x*100);
                    }
                    return x(d.x); 
                })
                .attr("cy", (d) => {
                    if (["consistency", "completeness"].includes(yAxisVariable)){
                        return y(d.y*100);
                    }
                    return y(d.y); 
                })
                .attr("r", d => {
                    return z(d.zValue);
                })
                .style("fill", d => myColor(d.zMetric))
                .style("opacity", 0.5)
            .on("mouseover", showTooltip )
            .on("mousemove", moveTooltip )
            .on("mouseleave", hideTooltip );
    }

    useEffect(() => {
        const transformedData = bubblePlotTransform(data, xAxisVariable, yAxisVariable, zAxisVariables);
        createBubblePlot(transformedData, xAxisVariable, yAxisVariable, zAxisVariables);
      }, [data, xAxisVariable, yAxisVariable, zAxisVariables]);
  
    return <div id="my_dataviz"></div>;
};

BubblePlot.propTypes = {
    data: PropTypes.array,
    xAxisVariable: PropTypes.string,
    yAxisVariable: PropTypes.string,
    zAxisVariables: PropTypes.array
  };

export default BubblePlot;
  