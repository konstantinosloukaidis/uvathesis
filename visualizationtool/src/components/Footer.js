import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();
    const curLocation = useLocation();
    return (
        <div style={{ textAlign: 'center', padding: '1px', background: '#f1f1f1', bottom: 0, width: '100%' }}>
            <img src={`${process.env.PUBLIC_URL}/uva_logo.png`} alt='UVA LOGO'/> | About <FontAwesomeIcon icon={faCircleInfo} onClick={() => navigate("/about", { state: { referrer: curLocation.pathname } })} style={{ marginLeft: "5px", cursor: "pointer"}}/>

        </div>
    );
};

export default Footer;