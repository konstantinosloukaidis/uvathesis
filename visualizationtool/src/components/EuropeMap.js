import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const EuropeMap = ({ data, countryInfo }) => {
    const ref = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        if (data && countryInfo) {
            const svg = d3.select(ref.current);
            svg.selectAll("*").remove();

            const projection = d3.geoMercator().fitSize([800, 600], data);
            const pathGenerator = d3.geoPath().projection(projection);

            const countryMap = new Map(countryInfo.map(item => [item.country, {
                availability: item.available, 
                code: item.code
            }]));

            svg.selectAll('.country')
                .data(data.features)
                .enter().append('path')
                .attr('class', 'country')
                .attr('d', pathGenerator)
                .attr('cursor', 'pointer')
                .attr('fill', d => countryMap.get(d.properties.name).availability ? '#90ee90' : '#ffcccb')
                .on('mouseover', function(_, d) {
                    d3.select(this).style('fill', d => countryMap.get(d.properties.name).availability ? '#6fa36f' : '#d69999');
                })
                .on('mouseout', function(_, d) {
                    d3.select(this).style('fill', d => countryMap.get(d.properties.name).availability ? '#90ee90' : '#ffcccb');
                })
                .attr('stroke', '#333')
                .on('click', function(_, d) {
                    navigate(`/plots/${countryMap.get(d.properties.name).code}`);
                })
        }
    }, [data, countryInfo, navigate]);

    return <svg ref={ref} width={800} height={600} />;
};

EuropeMap.propTypes = {
    data: PropTypes.object,
    countryInfo: PropTypes.array
};

export default EuropeMap;
