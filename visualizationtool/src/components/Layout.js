import React from 'react';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1 }}>
                {children}
            </div>
            <Footer />
        </div>
    );
};

export default Layout;