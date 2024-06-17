import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons';
import FileCard from '../components/FileCard';
import { logActivity } from '../utils/user-logger';
        
const FilePage = () => {
    const { country, filename } = useParams();
    const [fileData, setFileData] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetch(`/api/document/${filename}`)
            .then((res) => res.json())
            .then((data) => {                
                setFileData(data);
            });

        const start = new Date();

        const logTimeSpent = () => {
            logActivity({
                activity: "file",
                spec: filename,
                parameters: null
            }, start, null, filename, null);
        };

        return logTimeSpent;

    }, [filename, country])

    return (
        <div className="main-container" >
            <Card 
                style={{width: "50%"}}        
                title={
                    <div>
                        <FontAwesomeIcon icon={faArrowAltCircleLeft} onClick={() => navigate(`/plots/${country}`)} style={{ marginRight: "5px", cursor: "pointer"}}/>
                        <FontAwesomeIcon icon={faMap} onClick={() => navigate("/map")} style={{ marginRight: "5px", cursor: "pointer"}}/>
                        <span className="break-filename">File information: {filename}</span>
                    </div>
                }
            >   
                {fileData &&             
                    <FileCard fileData={fileData.data}/>
                }
            </Card>
        </div>
    )
}

export default FilePage;


