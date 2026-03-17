import React from 'react';
import noDataImg from '../../assets/images/no-data.png';

const NoData = ({ message = "No data available at the moment." }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            textAlign: 'center'
        }}>
            <img
                src={noDataImg}
                alt="No Data"
                style={{
                    width: '180px',
                    height: 'auto',
                    marginBottom: '16px',
                    opacity: 0.8
                }}
            />
            <p style={{
                color: '#6b7280',
                fontSize: '15px',
                fontWeight: 500,
                margin: 0
            }}>
                {message}
            </p>
        </div>
    );
};

export default NoData;
