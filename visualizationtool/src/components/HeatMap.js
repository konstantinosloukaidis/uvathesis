import React, { useEffect } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { FIVE_COLOUR_SCHEME, SEVEN_COLOUR_SCHEME, 
    PERCENTAGE_METRICS, PERCENTAGE_VALUES_DOMAIN, 
    FIVE_STAR_RATING_DOMAIN } from '../utils/constants';
import { firstLetterUppercase, fixHeatmapData, sortByVariable } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';

const HeatMap = ({ data, sortKey, selectedLabels, setSelectedLabels, country, sortDesc }) => {

    const navigate = useNavigate();
        
    const colorScaleCompleteness = d3.scaleThreshold()
        .domain(PERCENTAGE_VALUES_DOMAIN)
        .range(SEVEN_COLOUR_SCHEME);

    const colorScaleAccessibility = d3.scaleThreshold()
        .domain(FIVE_STAR_RATING_DOMAIN)
        .range(FIVE_COLOUR_SCHEME);

    function getColor(value, metric) {
        return PERCENTAGE_METRICS.includes(metric) ? colorScaleCompleteness(value) : colorScaleAccessibility(value);
    }

    function projectData(value, metric) {
        return PERCENTAGE_METRICS.includes(metric) ? (value*100).toFixed(2) + "%" : value + " stars"
    }

    const toggleLabel = (label) => {
        setSelectedLabels(currentLabels => {
          const index = currentLabels.indexOf(label);
          if (index > -1) {
            return currentLabels.filter(item => item !== label);
          } else if (currentLabels.length < 5) {
            return [...currentLabels, label];
          }
          return currentLabels;
        });
      };

    const openSource = (label) => {
        navigate(`/document/${country}/${label}`);
    }

    useEffect(() => {
        updateLabelStyles();
    });

    const updateLabelStyles = () => {
        const labels = d3.select("#my_dataviz").selectAll(".x-axis-label");
    
        labels.each(function(d) {
            const textElement = d3.select(this);
            const bbox = textElement.node().getBBox();
            const padding = 5;
            const parent = d3.select(this.parentNode);
            const rectSelection = parent.select("rect.label-background");
    
            if (selectedLabels.includes(d)) {
                if (rectSelection.empty()) {
                    parent.insert("rect", ":first-child")
                        .attr("x", bbox.x - padding)
                        .attr("y", bbox.y - padding)
                        .attr("width", bbox.width + 2 * padding)
                        .attr("height", bbox.height + 2 * padding)
                        .attr("rx", 10) // Rounded corners
                        .attr("ry", 10) // Rounded corners
                        .classed("label-background", true)
                        .style("fill", "none")
                        .style("stroke", "black")
                        .style("stroke-width", "2px");
                }
            } else {
                rectSelection.remove();
            }
        });
    };       

    function createHeatmap(data) {
        d3.select("#my_dataviz svg").remove();
        const xLabels = ["accessibility", "completeness", "consistency", "retrieval", "currency"];
        let numGroups = new Set(data.map(d => d.group)).size;
        if (numGroups < 10) numGroups = 10
        const margin = {top: 30, right: 25, bottom: 5, left: 200},
            width =  xLabels.length * 180 - margin.left - margin.right,
            height = numGroups * 50 - margin.top - margin.bottom;
    
        const svg = d3.select("#my_dataviz")
            .append("svg")
            .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    
        const x = d3.scaleBand()
            .range([ 0, width])
            .domain(xLabels)
            .padding(0.05);
    
        const y = d3.scaleBand()
            .range([ height, 0 ])
            .domain(data.map(d => d.group))
            .padding(0.05);
    
        svg.append("g")
            .style("font-size", 40)
            .attr("transform", `translate(0, ${-20})`)
            .call(d3.axisBottom(x).tickSize(0))
            .selectAll("text")
            .text(d => firstLetterUppercase(d))
            .style("cursor", "pointer")
            .classed("x-axis-label", true)
            .on("click", (_, d) => {
                toggleLabel(d);
            });
        
        svg.append("g")
            .style("font-size", 40)
            .call(d3.axisLeft(y).tickSize(0))
            .selectAll("text")
            .style("cursor", "pointer")
            .classed("y-axis-label", true)
            .on("click", (_, d) => {
                openSource(d);
            });;
                
        svg.select(".domain") // Removes x axis border line
            .remove();
    
        svg.select(".domain") // Removes y axis border line
            .remove();

        // Add the squares
        svg.selectAll()
            .data(data, function(d) { return d.group; })
            .join("rect")
            .attr("x", d => x(d.variable))
            .attr("y", d => y(d.group))
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", function(d) { return getColor(d.value, d.variable) })
            .style("stroke-width", 4)
            .style("stroke", "none")
            .style("opacity", 0.8)
            .each(function(d) {
                svg.append("text")
                .attr("x", x(d.variable) + x.bandwidth() / 2)
                .attr("y", y(d.group) + y.bandwidth() / 2)
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle")
                .style("font-size", "12px")
                .text(projectData(d.value, d.variable));
            });
    }

    useEffect(() => {
        let fixedData = fixHeatmapData(data);
        fixedData = fixedData.sort((a, b) => {
            return sortByVariable(a, b, sortKey, sortDesc);
        });
        createHeatmap(fixedData);
        updateLabelStyles();
      });
  
    return <div id="my_dataviz"></div>;
}

HeatMap.propTypes = {
    data: PropTypes.array,
    sortKey: PropTypes.string,
    selectedLabels: PropTypes.array,
    setSelectedLabels: PropTypes.func,
    country: PropTypes.string,
    sortDesc: PropTypes.bool
  };

export default HeatMap;