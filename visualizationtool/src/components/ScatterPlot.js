import React, { useEffect } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { FIVE_STAR_RATING_METRICS, PERCENTAGE_METRICS } from '../utils/constants';
import { firstLetterUppercase } from '../utils/helpers';

const ScatterPlot = ({ data, xAxisVariable, yAxisVariable }) => {

    function createScatterPlot(data, xAxisVariable, yAxisVariable) {
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
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
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
            yDomain = [1, 5];
            yTicks = 5;
        }
    
        // Add X axis
        const x = d3.scaleLinear()
            .domain(xDomain)
            .range([0, width]);
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x).ticks(xTicks));
    
        // Add Y axis
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

        svg.append('g')
            .attr('class', 'x axis-grid')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(x).tickSize(-height).tickFormat('').ticks(xTicks*2));

        svg.append('g')
            .attr('class', 'y axis-grid')
            .call(d3.axisLeft(y).tickSize(-width).tickFormat('').ticks(yTicks*2));

        const tooltip = d3.select("#my_dataviz")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "black")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("color", "white")
            .style("position", "absolute");

        const showTooltip = function(event, d) {
            tooltip
              .transition()
              .duration(200)
            tooltip
              .style("opacity", 1)
              .html(d.file)
              .style("left", (event.pageX)/2 + "px")
              .style("top", (event.pageY)/2 + "px")
        };

        const moveTooltip = function(event, d) {
            tooltip
              .style("left", (event.pageX)/2 + "px")
              .style("top", (event.pageY)/2 + "px")
        };
        
        const hideTooltip = function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0);
        };
            
        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .join("circle")
            .attr("class", "bubbles")
            .attr("cx", function (d) {
                if (["consistency", "completeness"].includes(xAxisVariable)){
                    return x(d[xAxisVariable]*100);
                }
                return x(d[xAxisVariable]); 
            })
            .attr("cy", function (d) {
                if (["consistency", "completeness"].includes(yAxisVariable)){
                    return y(d[yAxisVariable]*100);
                }
                return y(d[yAxisVariable]); 
            })
            .attr("r", 10)
            .style("fill", "#005a32")
            .style("opacity", 0.5)
        .on("mouseover", showTooltip )
        .on("mousemove", moveTooltip )
        .on("mouseleave", hideTooltip );
    
    }

    useEffect(() => {
        createScatterPlot(data, xAxisVariable, yAxisVariable);
      }, [data, xAxisVariable, yAxisVariable]);
  
    return <div id="my_dataviz"></div>;
};

ScatterPlot.propTypes = {
    data: PropTypes.array,
    xAxisVariable: PropTypes.string,
    yAxisVariable: PropTypes.string
  };

export default ScatterPlot;
  