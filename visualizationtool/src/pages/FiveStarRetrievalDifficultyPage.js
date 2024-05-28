import React from 'react';
import { List, Rate, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const { Title, Paragraph } = Typography;

const FiveStarRetrievalDifficultyPage = () => {
    const navigate = useNavigate();

    const data = [
        {
            star: 1,
            title: 'One Star',
            description: 'Paywalled or Permission-Required: Highest difficulty due to financial or administrative barriers.'
        },
        {
            star: 2,
            title: 'Two Stars',
            description: 'Indirect Access Only: Available through reports or published results, requiring extra effort to extract data.'
        },
        {
            star: 3,
            title: 'Three Stars',
            description: 'Direct but Rate-Limited Access: Accessible online in a readable format, but restricted by API rate limits or pagination.'
        },
        {
            star: 4,
            title: 'Four Stars',
            description: 'Conditional Bulk Access: Bulk download available, may require registration or agreement to terms, potentially large and unwieldy files.'
        },
        {
            star: 5,
            title: 'Five Stars',
            description: 'Open and Optimized Access: Freely available, no registration, in an easily ingestible format with comprehensive documentation.'
        },
    ];

    return (
        <div className="main-container" >
            <Title style={{ marginRight: "50px" }}level={2}>
                <FontAwesomeIcon icon={faArrowLeft} onClick={() => navigate("/information/metrics")} style={{ marginRight: "5px", cursor: "pointer"}}/>
                Five Star Retrieval Difficulty</Title>
            <List
                itemLayout="vertical"
                dataSource={data}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            title={
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Rate disabled defaultValue={item.star} style={{ marginRight: '10px' }} />
                                    <span>{item.title}</span>
                                </div>
                            }
                        />
                        <Paragraph>{item.description}</Paragraph>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default FiveStarRetrievalDifficultyPage;
