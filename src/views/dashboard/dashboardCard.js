import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CFormInput,
    CFormLabel,
    CRow,
    CFormCheck,
    CSpinner,
    CInputGroup,
} from '@coreui/react';
import { cilCheckCircle, cilXCircle, cilTrash, cilPuzzle } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
const DashboardCard = ({ title, subtitle, mainValue, subValue, subValueLabel , icon }) => {

    const getStatusColor = (value) => {
        
        value = Number(value.replace('%',''));
        if(value >= 85 ){
            return '#28a745'; // Green
        }else if(value >= 50 && value <= 85){
            return '#ffc107'; // Yellow
        }
        else if(value <= 50){
            return '#dc3545'; // Red
        }else{
            return '#6c757d'; // Gray
        }
        
    };

    const getStatusIcon = (value) => {
        value = Number(value.replace('%',''));
        if(value > 85 ){
            return '#28a745'; // Green
        }else if(value > 50 && value < 85){
            return '#ffc107'; // Yellow
        }
        else if(value < 50){
            return '#dc3545'; // Red
        }else{
            return '#6c757d'; // Gray
        }
    };


    return (
        <CCard className="mb-4 shadow-sm" >
          <CCardHeader style={{ backgroundColor: '#f8f9fa', borderBottom: `1px solid ${getStatusColor(subValue)}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <h5 className="mb-0">{title}</h5>
                <small>{subtitle}</small>
            </div>
            <CIcon icon={icon} style={{ color:getStatusColor(subValue)}} />
        </CCardHeader>
        <CCardBody>
            <CRow>
                <CCol>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                        {mainValue}
                    </div>
                     
                    
                </CCol>
                <CCol>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'right', color: getStatusColor(subValue) }}>
                        {subValue}
                    </div>
                    <div style={{ fontSize: '16px', color: getStatusColor(subValue) , textAlign:'right' }}>
                        {subValueLabel}
                    </div>
                </CCol>
            </CRow>
        </CCardBody>
    </CCard>
    );
};

export default DashboardCard;