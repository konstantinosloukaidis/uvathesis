import React from 'react';
import { Card } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faAt, faBoltLightning } from '@fortawesome/free-solid-svg-icons';

const AboutPage = () => {
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
                style={{width: "50%"}}   
                title={
                    <div>
                        <FontAwesomeIcon icon={faArrowAltCircleLeft} onClick={returnToReferrer} style={{ marginRight: "5px", cursor: "pointer"}}/>
                        <FontAwesomeIcon icon={faMap} onClick={() => navigate("/map")} style={{ marginRight: "5px", cursor: "pointer"}}/>
                    </div>
                }
            >
                <div style={{ textAlign: 'center' }}>
                    <h2>About this project</h2>
                    <p>
                        Hello! I am Konstantinos Loukaidis and this visulisation tool is a project for my master thesis in Software Engineering, University of Amsterdam, with title "Analysis and Information Visualisation of Train Data in the EU – A Case Study Using the Netherlands as the Point of Origin". The concept of the thesis is to research the availability, and the quality of railway datasets regarding the Netherlands, that are existent on the internet. This tool is used to visualise the datatsets found, in a exploratory style design, encouraging users to explore and engage with the data.
                    </p>
                    <p>
                        <strong>For more information, feel free to connect with me on LinkedIn or send me an email. </strong>
                        <FontAwesomeIcon icon={faLinkedin} style={{ marginLeft: "5px", cursor: "pointer", color: "blue", fontSize: "15px"}} onClick={() => window.open("https://www.linkedin.com/in/konstantinos-loukaidis-653b11225/", "_blank")}/>
                        <FontAwesomeIcon icon={faAt} style={{ marginLeft: "5px", cursor: "pointer", color: "blue", fontSize: "15px"}} onClick={() => window.open("mailto:konstantinos.loukaidis@student.uva.nl?subject=Visualisation%20Tool%20Referrer")}/>
                        <FontAwesomeIcon icon={faBoltLightning} style={{ marginLeft: "5px", cursor: "pointer", color: "blue", fontSize: "15px"}} onClick={() => window.open("https://www.youtube.com/watch?v=xvFZjo5PgG0&ab_channel=Duran&autoplay=1")}/>
                    </p>
                    <p>
                        You can also view the source of the project at my GitHub!
                        <FontAwesomeIcon icon={faGithub} style={{ marginLeft: "5px", cursor: "pointer", color: "black", fontSize: "15px"}} onClick={() => window.open("https://github.com/KonstantinosLoukaidis", "_blank")}/>
                    </p>
                </div>
            </Card>
        </div>
    )
}

export default AboutPage;
