import React, { useState } from 'react';
import { Tabs, Descriptions, Rate, Table, List, Modal, Button, Select, Input, Progress } from 'antd';
import PropTypes from 'prop-types';
import { UNIT_MAP, FREQUENCY_MAP, VERACITY_MAP, SDG_INDICATOR_MAP } from '../utils/constants';
import { nullTranslator, firstLetterUppercase } from '../utils/helpers';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faExclamationTriangle, faSeedling, faThumbsDown as dislikeBlue, faThumbsUp as likeBlue } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as likeWhite, faThumbsDown as dislikeWhite } from '@fortawesome/free-regular-svg-icons';

const { TextArea } = Input;
const { Option } = Select;

function FileCard({ fileData }) {
    const navigate = useNavigate();
    const curLocation = useLocation();

    const navigateToMetrics = () => {
        navigate("/information/metrics", { state: { referrer: curLocation.pathname } });
    }

    const sdgFooter = () => {
        return <>
            <div className="information-container">
                The current SDG indicators have been mapped based on our subjective judgment.
                <FontAwesomeIcon icon={faExclamationTriangle} style={{ marginLeft: "5px"}}/>
            </div>
            <span>More information about the indicators: <a href='https://unstats.un.org/sdgs/iaeg-sdgs/tier-classification' target='_blank' rel="noreferrer">IAEG-SDGs Tier Classification for Global SDG Indicators</a></span>

        </>
    }

    const [votes, setVotes] = useState(fileData.sdg_indicators_e?.map(sdg => ({
        indicator: sdg.indicator,
        likes: sdg.thumbsUp || 0,
        dislikes: sdg.thumbsDown || 0,
        userVote: null
    })) || []);
    
    const handleVote = (indicator, vote) => {
        setVotes(prevVotes => prevVotes.map(v => {
            if (v.indicator === indicator) {
                let newLikes = v.likes;
                let newDislikes = v.dislikes;

                if (vote === 'like') {
                    if (v.userVote === 'like') {
                        newLikes -= 1;
                    } else if (v.userVote === 'dislike') {
                        newDislikes -= 1;
                        newLikes += 1;
                    } else {
                        newLikes += 1;
                    }
                } else if (vote === 'dislike') {
                    if (v.userVote === 'dislike') {
                        newDislikes -= 1;
                    } else if (v.userVote === 'like') {
                        newLikes -= 1;
                        newDislikes += 1;
                    } else {
                        newDislikes += 1;
                    }
                }

                return {
                    ...v,
                    likes: newLikes,
                    dislikes: newDislikes,
                    userVote: v.userVote === vote ? null : vote
                };
            }
            return v;
        }));
        console.log(votes)
    };

    const sdgColumns = [
        {
            title: 'Indicator',
            dataIndex: 'indicator',
            key: 'indicator',
            width: 100,
            render: (text) => <strong>{text}</strong>
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Approval Rating',
            key: 'approvalRating',
            render: (_, record) => {
                const votesObj = votes.find((obj) => obj.indicator === record.indicator);
                const thumbsUp = Number(votesObj.likes) || 0;
                const thumbsDown = Number(votesObj.dislikes) || 0;
                const total = thumbsUp + thumbsDown;
                const percent = total === 0 ? 0 : (thumbsUp / total) * 100;
                const trailColor = total === 0 ? '#d9d9d9' : '#f5222d';
    
                return (
                    <div>
                        <Progress
                            percent={percent}
                            success={{ percent: percent }}
                            trailColor={trailColor}
                            format={() => ``}
                        />
                        <div style={{ textAlign: 'center', marginTop: '5px' }}>
                                <span style={{color: "green"}}>{thumbsUp}                         
                                    <FontAwesomeIcon 
                                        icon={votesObj.userVote === 'like' ? likeBlue : likeWhite} 
                                        onClick={() => handleVote(record.indicator, 'like')} 
                                        style={{marginLeft: 5, marginRight: 5, cursor: "pointer"}}
                                    /></span>/<span style={{color: "red", marginLeft: 5}}>{thumbsDown}                         
                                    <FontAwesomeIcon 
                                        icon={votesObj.userVote === 'dislike' ? dislikeBlue : dislikeWhite} 
                                        onClick={() => handleVote(record.indicator, 'dislike')}
                                        style={{marginLeft: 5, marginRight: 5, cursor: "pointer"}} 
                                /></span>
                        </div>
                    </div>
                );
            }
        }
      ];

    const sdgData = fileData.sdg_indicators_e?.map((sdg_indicator, index) => ({
            key: index,
            indicator: sdg_indicator.indicator,
            description: SDG_INDICATOR_MAP[sdg_indicator.indicator],
            comments: sdg_indicator.comments,
            thumbsUp: sdg_indicator.thumbsUp || 0,
            thumbsDown: sdg_indicator.thumbsDown || 0,
        }));

    const expandedRowRender = (record, onAddComment) => (
        <div>
                {record.comments.length > 0 && (
                    <div key={record.indicator}>
                        <List
                            size="small"
                            bordered
                            dataSource={record.comments}
                            renderItem={comment => 
                                <List.Item>
                                    <div>
                                        <div style={{ fontSize: '16px' }}>{comment.comment}</div>
                                        <div style={{ fontSize: '12px', color: 'gray' }}>- {comment.commentator}</div>
                                    </div>
                                </List.Item>
                            }
                        />
                        <Button type="primary" style={{marginTop: 16}} onClick={() => onAddComment(record.indicator)}>Add Comment</Button>
                    </div>
                )}
        </div>
    );

    const [data, setData] = useState(sdgData);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedIndicator, setSelectedIndicator] = useState('');
    const [selectedComment, setSelectedComment] = useState('');
    const [newSdg, setNewSdg] = useState(true);

    const handleAddSDG = () => {
        setNewSdg(true);
        showModal();
    }

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSave = () => {
        let newData = [];
        if (data.find((record) => record.indicator === selectedIndicator)){
            newData = data.map(record => {
                if (record.indicator === selectedIndicator) {
                    console.log(record)
                    return {
                        ...record,
                        comments: [...record.comments, {
                            comment: selectedComment,
                            commentator: "Current User"
                        }]
                    };
                }
                return record;
            });
        } else{
            newData = [...data, {
                key: (data.length + 1).toString(),
                indicator: selectedIndicator,
                description: SDG_INDICATOR_MAP[selectedIndicator],
                comments: [{comment: selectedComment, commentator: 'Current user'}]
            }];
        }
        setData(newData);
        setIsModalVisible(false);
        setSelectedIndicator('');
        setSelectedComment('');
        setNewSdg(true);
    };


    const handleAddComment = (indicator) => {
        setSelectedIndicator(indicator);
        setNewSdg(false);
        showModal();
    };

    const items = [
        {
            key: '1',
            label: "Metadata - General Information",
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
                    <Descriptions.Item label="Veracity">{VERACITY_MAP[fileData.veracity]}</Descriptions.Item>
                    <Descriptions.Item label="Data Group">{firstLetterUppercase(fileData.data_group)}</Descriptions.Item>
                </Descriptions>
        },
        {
            key: '2',
            label: "Metadata - Dates",
            children: 
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Publish date">{nullTranslator(fileData.publish_date)}</Descriptions.Item>
                    <Descriptions.Item label="Last update date">{nullTranslator(fileData.last_update_date)}</Descriptions.Item>
                    <Descriptions.Item label="Data collection date">{nullTranslator(fileData.data_collection_date)}</Descriptions.Item>
                    <Descriptions.Item label="Track of updates">{nullTranslator(fileData.track_updates)}</Descriptions.Item>
                    <Descriptions.Item label="Delay in Publication">{nullTranslator(fileData.delay_publication)}</Descriptions.Item>
                    <Descriptions.Item label="Delay in Update">{nullTranslator(fileData.delay_update)}</Descriptions.Item>
                </Descriptions>
        },
        {
            key: '3',
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
                    <Descriptions.Item label="Data coverage period">{parseInt(fileData.chronological_order_start)} - {parseInt(fileData.chronological_order_end)}</Descriptions.Item>
                    <Descriptions.Item label="Access Mechanism">{fileData.access_mechanism}</Descriptions.Item>
                </Descriptions>
        },
        {
            key: '4',
            label: 'Data',
            children:
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Data URL">{fileData.data_url ? <a href={fileData.data_url} target='_blank' rel="noreferrer">Link</a> : <span>No link available</span>}</Descriptions.Item>
                    <Descriptions.Item label="Metadata URL">{fileData.metadata_url ? <a href={fileData.metadata_url} target='_blank' rel="noreferrer">Link</a> : <span>No link available</span>}</Descriptions.Item>
                </Descriptions>
        },
        {
            key: '5',
            label: <span style={{color: 'green' }}>SDG Indicators <FontAwesomeIcon icon={faSeedling} onClick={navigateToMetrics} style={{ marginLeft: "5px"}} /></span>,
            hidden: !fileData.sdg_indicators_e || fileData.sdg_indicators_e.length < 1,
            children:
                <>
                <Button onClick={handleAddSDG} type="primary" style={{ marginBottom: 16 }}>
                    Add a new SDG indicator
                </Button>
                <Table
                    columns={sdgColumns}
                    dataSource={data}
                    pagination={false}
                    sticky={true}
                    bordered
                    footer={() => sdgFooter()}
                    expandable={{
                        expandedRowRender: record => expandedRowRender(record, handleAddComment),
                        rowExpandable: record => record?.comments.length > 0,                    
                    }}
                />
                </>
        }
    ].filter(i => !i.hidden)

    return (
        <div style={{ height: '580px', width: '100%' }}>
            <Tabs defaultActiveKey="1" items={items} style={{ height: '100%', overflow: 'auto' }}/>
            <Modal
                title="Add a new SDG indicator"
                open={isModalVisible}
                onOk={handleSave}
                okText={newSdg ? 'Add a new SDG indicator' : 'Add comment' }
                onCancel={handleCancel}
            >
                <Select
                    placeholder="Select an SDG Indicator"
                    style={{ width: '100%', marginBottom: 16 }}
                    value={selectedIndicator}
                    onChange={value => setSelectedIndicator(value)}
                    disabled={!newSdg}
                >
                    <Option value="3.6.1">3.6.1</Option>
                    <Option value="9.1.1">9.1.1</Option>
                    <Option value="9.1.2">9.1.2</Option>
                    <Option value="11.2.1">11.2.1</Option>
                    <Option value="7.3.1">7.3.1</Option>
                    <Option value="12.c.1">12.c.1</Option>
                    <Option value="11.6.2">11.6.2</Option>
                </Select>
                <TextArea
                    placeholder="Give explanation"
                    rows={4}
                    value={selectedComment}
                    onChange={e => setSelectedComment(e.target.value)}
                />
            </Modal>
        </div>
    );
}

FileCard.propTypes = {
    fileData: PropTypes.object
};

export default FileCard;