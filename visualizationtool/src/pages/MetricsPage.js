import React from 'react';
import { Card } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons';
import MetricsInformationCard from '../components/MetricsInformationCard';
import { useNavigate, useLocation } from 'react-router-dom';

const MetricsPage = () => {
    const navigate = useNavigate();
    const curLocation = useLocation();
    const referrer = curLocation.state?.referrer;

    const returnToReferrer = () => {
        if (referrer) {
            navigate(referrer);
        } else {
            navigate('/map');
        }
    }


    return (
        <div className="main-container" >
            <Card         
                title={
                    <div>
                        <FontAwesomeIcon icon={faArrowAltCircleLeft} onClick={returnToReferrer} style={{ marginRight: "5px", cursor: "pointer"}}/>
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


