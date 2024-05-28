import React, { useState, useEffect } from 'react';
import EuropeMap from '../components/EuropeMap';
import * as d3 from 'd3';

const EuropeMain = () => {
  const [geoData, setGeoData] = useState(null);
  const [countryInfo, setCountryInfo] = useState(null);

  useEffect(() => {
      Promise.all([
        d3.json("https://gist.githubusercontent.com/spiker830/3eab0cb407031bf9f2286f98b9d0558a/raw/7edae936285e77be675366550e20f9166bed0ed5/europe_features.json"),
        d3.json('sources/europe_countries.json')
      ]).then(([data, mapper]) => {
        setGeoData(data);
        setCountryInfo(mapper);
      });
  }, []);

    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0dbc1' }}>
            {geoData && countryInfo ? (
                <EuropeMap data={geoData} countryInfo={countryInfo} />
            ) : (
                <p>Loading...</p>
            )}
      </div>
    );
};

export default EuropeMain;
