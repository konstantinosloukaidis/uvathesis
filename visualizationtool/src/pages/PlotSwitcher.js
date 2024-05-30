import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Select, Card, Button, Slider } from 'antd';
import PlotCard from '../components/PlotCard';
import HeatMap from '../components/HeatMap';
import { useParams, useNavigate } from 'react-router-dom';
import { firstLetterUppercase, filterData, countByDataGroup } from '../utils/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap } from '@fortawesome/free-regular-svg-icons';
import { faArrowRotateLeft, faCircleInfo, faArrowUpWideShort, faArrowDownShortWide } from '@fortawesome/free-solid-svg-icons'
import BubblePlot from '../components/BubblePlot';
import ScatterPlot from '../components/ScatterPlot';
import { BUBBLE_PLOT_COLOUR_SCHEME } from '../utils/constants';
import BarPlot from '../components/BarPlot';
import { logActivity } from '../utils/user-logger';

const PlotSwitcher = () => {

    const [originalData, setOriginalData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [groupKey, setGroupKey] = useState('all');
    const [sliderValue, setSliderValue] = useState([1970, 2024]);
    const navigate = useNavigate();
    const { country } = useParams();

    const fetchOriginalData = useMemo(() => async () => {
        fetch(`/api/${country}`)
            .then((res) => res.json())
            .then((data) => {
                setOriginalData(data.data);
                setFilteredData(filterData(data.data, sliderValue, groupKey));
            });
    }, [country]);

    const calculateMetricsHook = useMemo(() => async () => {
        if (originalData.length > 0) {
            setFilteredData(filterData(originalData, sliderValue, groupKey));
        }
    }, [sliderValue, originalData, groupKey]);


    const plotFilteredData = filteredData.map(({ file, completeness, consistency, accessibility, retrieval, currency }) => ({
        file, completeness, consistency, accessibility, retrieval, currency
    }));

    useEffect(() => {
        fetchOriginalData();
    }, [fetchOriginalData])

    useEffect(() => {
        calculateMetricsHook();
    }, [calculateMetricsHook])

    const [sortKey, setSortKey] = useState('accessibility');
    const [sortDesc, setSortDesc] = useState(true);
    const [selectedLabels, setSelectedLabels] = useState([]);
    const [scatterPlot, setScatterPlot] = useState(false);
    const [bubblePlot, setBubblePlot] = useState(false);
    const [barPlot, setBarPlot] = useState(false);
    const [heatMap, setHeatMap] = useState(true);

    const handleSortChange = value => {
        setSortKey(value);
    };

    const handleGroupChange = value => {
        setGroupKey(value);
    };

    const handleSliderChange = value => {
        setSliderValue(value);
    };

    const resetOptions = () => {
        setBubblePlot(false);
        setScatterPlot(false);
        setHeatMap(true);
        setBarPlot(false);
        setFilteredData(filterData(originalData, [1970, 2024], 'all'));
        setSliderValue([1970, 2024]);
        setSelectedLabels([]);
        setSortKey("accessibility");
        setGroupKey('all');
        setSortDesc(true);
    }


    const [currentPlot, setCurrentPlot] = useState("heatmap");
    const [startTime, setStartTime] = useState(new Date())
    const handlePlotButtonClick = (plot) => {
        logActivity({
            activity: "plot",
            spec: currentPlot,
            parameters: selectedLabels
        }, startTime, setStartTime, plot, setCurrentPlot);
    }

    return (
        <div className="main-container">
            <Card
                title={
                    <div>
                        <FontAwesomeIcon icon={faMap} onClick={() => navigate("/map")} style={{ marginRight: "5px", cursor: "pointer" }} />
                        Plots for {country}
                    </div>
                }
                className='card-container'
            >

                <Row gutter={16}>
                    <Col span={6}>
                        <div className="information-container">
                            Information about the metrics
                            <FontAwesomeIcon icon={faCircleInfo} onClick={() => navigate("/information/metrics")} style={{ marginLeft: "5px", cursor: "pointer" }} />
                        </div>
                        <div>
                            {heatMap &&
                                <>
                                    <h3>Choose to sort:</h3>
                                    <Select
                                        placeholder="Sort by"
                                        style={{ width: '80%', marginBottom: '10px' }}
                                        onChange={handleSortChange}
                                        defaultValue={"accessibility"}
                                    >
                                        <Select.Option value="accessibility">Accessibility</Select.Option>
                                        <Select.Option value="completeness">Completeness</Select.Option>
                                        <Select.Option value="consistency">Consistency</Select.Option>
                                        <Select.Option value="retrieval">Retrieval</Select.Option>
                                        <Select.Option value="currency">Currency</Select.Option>
                                    </Select>
                                    <FontAwesomeIcon icon={sortDesc ? faArrowUpWideShort : faArrowDownShortWide} onClick={() => setSortDesc(!sortDesc)} style={{ marginLeft: "10px", cursor: "pointer" }} />
                                </>
                            }
                        </div>
                        <h3>Filter datasets based on group:</h3>
                        <Select
                            placeholder="Sort by"
                            style={{ width: '80%', marginBottom: '10px' }}
                            onChange={handleGroupChange}
                            defaultValue={"all"}
                        >
                            <Select.Option value="all">All</Select.Option>
                            <Select.Option value="coverage">Coverage</Select.Option>
                            <Select.Option value="trip frequency">Trip Frequency</Select.Option>
                            <Select.Option value="sustainability">Sustainability</Select.Option>
                            <Select.Option value="comfort">Comfort</Select.Option>
                        </Select>
                        {heatMap &&
                            <div>
                                <h3>Interested in other plots?</h3>
                                <Row gutter={4}>
                                    <Col>
                                        <Button
                                            type="primary"
                                            disabled={selectedLabels.length < 2}
                                            onClick={() => {
                                                setScatterPlot(true);
                                                setHeatMap(false);
                                                handlePlotButtonClick("scatter");
                                            }}>
                                            Scatter Plot
                                        </Button>
                                    </Col>
                                    <Col >
                                        <Button
                                            type="primary"
                                            disabled={selectedLabels.length < 3}
                                            onClick={() => {
                                                setBubblePlot(true);
                                                setHeatMap(false);
                                                handlePlotButtonClick("bubble");
                                            }}
                                        >
                                            Bubble Plot
                                        </Button>
                                    </Col>
                                </Row>
                                <div style={{ marginTop: '10px' }}>
                                    <Button
                                        type="primary"
                                        onClick={() => {
                                            setBarPlot(true);
                                            setHeatMap(false);
                                            handlePlotButtonClick("bar")
                                        }}
                                    >
                                        Data Groups Bar Plot
                                    </Button>
                                </div>
                            </div>
                        }
                        {(scatterPlot || bubblePlot || barPlot) &&
                            <Button
                                type="primary"
                                onClick={() => {
                                    setBubblePlot(false);
                                    setScatterPlot(false);
                                    setBarPlot(false);
                                    setHeatMap(true);
                                    handlePlotButtonClick("heatmap");
                                }}
                            >
                                Heat map
                            </Button>
                        }
                        {!barPlot &&
                            <>
                                <h3>Filter years ({sliderValue[0]}-{sliderValue[1]})</h3>
                                <Slider range min={1970} max={2024}
                                    value={[sliderValue[0], sliderValue[1]]}
                                    onChange={handleSliderChange}
                                />
                            </>
                        }
                        <div>
                            <h3 style={{ display: "inline" }}>Reset options &#129398;:</h3>
                            <FontAwesomeIcon icon={faArrowRotateLeft} onClick={() => resetOptions()} style={{ marginLeft: "5px", cursor: "pointer" }} />
                        </div>
                        {selectedLabels.length > 0 && (
                            <div className="legend-container">
                                <h3>Legend</h3>
                                {
                                    <div key={1} className="legend-item">
                                        <span>X axis: {firstLetterUppercase(selectedLabels[0])}</span>
                                    </div>
                                }
                                {selectedLabels.length > 1 &&
                                    <div key={2} className="legend-item">
                                        <span>Y axis: {firstLetterUppercase(selectedLabels[1])}</span>
                                    </div>
                                }
                                {selectedLabels.slice(2).map((label, index) => (
                                    index < 3 && (
                                        <div key={index} className="legend-item">
                                            <div className="legend-color" style={{ backgroundColor: BUBBLE_PLOT_COLOUR_SCHEME[index] }}></div>
                                            <span>: {firstLetterUppercase(label)}</span>
                                        </div>
                                    )
                                ))}
                            </div>
                        )}
                    </Col>
                    <Col span={18} style={{ overflow: 'auto' }}>
                        <PlotCard>
                            {heatMap &&
                                <HeatMap
                                    data={plotFilteredData}
                                    sortKey={sortKey}
                                    sortDesc={sortDesc}
                                    selectedLabels={selectedLabels}
                                    setSelectedLabels={setSelectedLabels}
                                    country={country}
                                />
                            }
                            {scatterPlot &&
                                <ScatterPlot
                                    data={plotFilteredData}
                                    xAxisVariable={selectedLabels[0]}
                                    yAxisVariable={selectedLabels[1]}
                                />
                            }
                            {bubblePlot &&
                                <BubblePlot
                                    data={plotFilteredData}
                                    xAxisVariable={selectedLabels[0]}
                                    yAxisVariable={selectedLabels[1]}
                                    zAxisVariables={selectedLabels.slice(2)}
                                />
                            }
                            {barPlot &&
                                <BarPlot
                                    data={countByDataGroup(originalData)}
                                />
                            }
                        </PlotCard>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default PlotSwitcher;
