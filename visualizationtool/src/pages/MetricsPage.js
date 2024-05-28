import React from 'react';
import { Card } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap } from '@fortawesome/free-regular-svg-icons';
import MetricsInformationCard from '../components/MetricsInformationCard';
import { useNavigate } from 'react-router-dom';

const MetricsPage = () => {
    const navigate = useNavigate();

    return (
        <div className="main-container" >
            <Card         
                title={
                    <div>
                        <FontAwesomeIcon icon={faMap} onClick={() => navigate("/map")} style={{ marginRight: "5px", cursor: "pointer"}}/>
                        Metrics Information
                    </div>
                }
            >   
                <MetricsInformationCard />
            </Card>
        </div>
    )
}

export default MetricsPage;


