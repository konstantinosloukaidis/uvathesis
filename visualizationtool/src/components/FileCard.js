import React from 'react';
import { Tabs, Descriptions, Rate } from 'antd';
import PropTypes from 'prop-types';
import { UNIT_MAP, FREQUENCY_MAP, VERACITY_MAP } from '../utils/constants';
import { nullTranslator, firstLetterUppercase } from '../utils/helpers';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

function FileCard({ fileData }) {
    const navigate = useNavigate();
    const curLocation = useLocation();

    const navigateToMetrics = () => {
        navigate("/information/metrics", { state: { referrer: curLocation.pathname } });
    }

    const items = [
        {
            key: '1',
            label: "Metadata",
            children: 
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Country">
                        {fileData.country.map((country, index) => (
                            <React.Fragment key={country}>
                                <img 
                                    src={`https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/${country.toUpperCase()}.svg`} 
                                    style={{ height: '3em', verticalAlign: 'middle'}}
                                    alt={country.toUpperCase()}
                                />
                                {index < fileData.country.length - 1 && ' / '}
                            </React.Fragment>
                        ))}
                    </Descriptions.Item>
                    <Descriptions.Item label="Source">{fileData.source}</Descriptions.Item>
                    <Descriptions.Item label="Frequency">{fileData.frequency ? FREQUENCY_MAP[fileData.frequency.trim()] : "No data"}</Descriptions.Item>
                    <Descriptions.Item label="Unit">{fileData.unit ? UNIT_MAP[fileData.unit.trim()] ? UNIT_MAP[fileData.unit.trim()] : fileData.unit : "No data"}</Descriptions.Item>
                    <Descriptions.Item label="Track of updates">{fileData.track_updates}{fileData.last_update_date && "(" + fileData.last_update_date + ")"}</Descriptions.Item>
                    <Descriptions.Item label="Delay in Publication">{nullTranslator(fileData.delay_publication)}</Descriptions.Item>
                    <Descriptions.Item label="Publish date">{nullTranslator(fileData.publish_date)}</Descriptions.Item>
                    <Descriptions.Item label="Veracity">{VERACITY_MAP[fileData.veracity]}</Descriptions.Item>
                    <Descriptions.Item label="Data Group">{firstLetterUppercase(fileData.data_group)}</Descriptions.Item>
                </Descriptions>
        },
        {
            key: '2',
            label: "Metrics",
            children: 
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Complete Cells">{fileData.available_completeness_cells ? (fileData.available_completeness_cells*100).toFixed(2) + "%" : "No data"}
                        <FontAwesomeIcon icon={faCircleInfo} onClick={navigateToMetrics} style={{ marginLeft: "5px", cursor: "pointer"}}/>
                    </Descriptions.Item>
                    <Descriptions.Item label="Complete Rows">{fileData.available_completeness_rows ? (fileData.available_completeness_rows*100).toFixed(2) + "%" : "No data"}
                        <FontAwesomeIcon icon={faCircleInfo} onClick={navigateToMetrics} style={{ marginLeft: "5px", cursor: "pointer"}}/>
                    </Descriptions.Item>
                    <Descriptions.Item label="Consistent Cells">{ fileData.available_consistency_cells ? (fileData.available_consistency_cells*100).toFixed(2) + "%" : "No data"}
                        <FontAwesomeIcon icon={faCircleInfo} onClick={navigateToMetrics} style={{ marginLeft: "5px", cursor: "pointer"}}/>
                    </Descriptions.Item>
                    <Descriptions.Item label="Consistent Rows">{ fileData.available_consistency_rows ? (fileData.available_consistency_rows*100).toFixed(2) + "%" : "No data"}
                        <FontAwesomeIcon icon={faCircleInfo} onClick={navigateToMetrics} style={{ marginLeft: "5px", cursor: "pointer"}}/>
                    </Descriptions.Item>
                    <Descriptions.Item label="Accessibility"><Rate value={fileData.accessibility} disabled/>
                        <FontAwesomeIcon icon={faCircleInfo} onClick={() => window.open("https://5stardata.info/en/")} style={{ marginLeft: "5px", cursor: "pointer"}}/>
                    </Descriptions.Item>
                    <Descriptions.Item label="Retrieval"><Rate value={fileData.retrieval} disabled/>
                        <FontAwesomeIcon icon={faCircleInfo} onClick={() => navigate("/information/five-star-retrieval-difficulty", { state: { referrer: curLocation.pathname } })} style={{ marginLeft: "5px", cursor: "pointer"}}/>
                    </Descriptions.Item>
                    <Descriptions.Item label="Chronological Order Available">{fileData.chronological_order_start} - {fileData.chronological_order_end}</Descriptions.Item>
                    <Descriptions.Item label="Access Mechanism">{fileData.access_mechanism}</Descriptions.Item>
                </Descriptions>
        },
        {
            key: '3',
            label: 'Data',
            children:
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Data URL">{fileData.data_url ? <a href={fileData.data_url} target='_blank' rel="noreferrer">Link</a> : <span>No link available</span>}</Descriptions.Item>
                    <Descriptions.Item label="Metadata URL">{fileData.metadata_url ? <a href={fileData.metadata_url} target='_blank' rel="noreferrer">Link</a> : <span>No link available</span>}</Descriptions.Item>
                </Descriptions>
        }
    ]

    return (
        <div style={{ height: '580px', width: '100%' }}>
            <Tabs defaultActiveKey="1" items={items} style={{ height: '100%', overflow: 'auto' }}/>
        </div>
    );
}

FileCard.propTypes = {
    fileData: PropTypes.object
};

export default FileCard;