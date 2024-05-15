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
import Select from 'react-select';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import swal from 'sweetalert';

import DashboardCard from './dashboardCard';
import CIcon from '@coreui/icons-react';
import FastMovingItems from './fastMovingItems';
import FastExpiringItems from './expiringItems';
import { cil4k, cilReload, cilRoom, cilStream } from '@coreui/icons';

function Dashboard() {
    const axiosPrivate = useAxiosPrivate();
    const [loading, setLoading] = useState(false);
    const [medicineOptions, setMedicineOptions] = useState([]);
    const [selecteMedicine, setSelecteMedicine] = useState({});
    useEffect(() => {
        fetcInitialData()
    }, []);

    
    const dashbordUrl = '/dashboard';
    const medicineUri = '/medicine';
const fetcInitialData = async () => {
    setLoading(true);
    let medicineList = [];
 
    try {
        const headers = {
            'name': ''
        };
        const response = await axiosPrivate.get(medicineUri, { headers });
 


        response.data.map((type) => {
            return medicineList.push({ value: type.id, label: type.name })
        })
        setMedicineOptions(medicineList)
 
        if(selecteMedicine===undefined||selecteMedicine.value == undefined){
            setSelecteMedicine(medicineList[0]);
        }   

        const dashboardData = await axiosPrivate.get(dashbordUrl, { headers });
        console.log(dashboardData.data);

    } catch (error) {
        medicineList = [];
 
    }
    setLoading(false);
};

    const [activeIndex, setActiveIndex] = React.useState(0)
    const data = [
        { name: 'Jan', Receiving: 24, Issuing: 24 },
        { name: 'Feb', Receiving: 13, Issuing: 50 },
        { name: 'Mar', Receiving: 98, Issuing: 22 },
        { name: 'Apr', Receiving: 39, Issuing: 98 },
        { name: 'May', Receiving: 48, Issuing: 38 },
        { name: 'Jun', Receiving: 38, Issuing: 48 },
        { name: 'Jul', Receiving: 43, Issuing: 20 },
        { name: 'Aug', Receiving: 23, Issuing: 18 },
        { name: 'Sep', Receiving: 34, Issuing: 23 },
        { name: 'Oct', Receiving: 44, Issuing: 45 },
        { name: 'Nov', Receiving: 20, Issuing: 34 },
        { name: 'Dec', Receiving: 18, Issuing: 20 },
    ];
    
    const pieData = [
        { name: 'Main Store', value: 42 },
        { name: 'Phamacy', value: 26 },
        { name: 'OPD', value: 32 },
    ];

    const fastMovingItems = [
        { name: "Item 1", quantity: 120 },
        { name: "Item 2", quantity: 110 },
        { name: "Item 3", quantity: 105 },
        { name: "Item 4", quantity: 100 },
        { name: "Item 5", quantity: 95 },
       
    ];
    
    const onPieEnter = (data, index) => {
        setActiveIndex(index);
    }

    const handleMedicineChange = (selectedOption) => {
        setSelecteMedicine(selectedOption);
    };


    return (
        <>
        <CRow>
        <CCol xs={12} sm={4}>
        <DashboardCard 
                    title="Stock Requisitions" 
                    subtitle="Total requisitions overview"
                    mainValue="452"
                    subValue="92%"
                    subValueLabel="Completed Rate"
                    icon={cilRoom}
                />
        </CCol>
        <CCol xs={12} sm={4}>
        <DashboardCard 
                    title="Medicine Productions" 
                    subtitle="Total Production overview"
                    mainValue="10"
                    subValue="85%"
                    subValueLabel="Production Rate"
                    icon={cilStream}
                />
        </CCol>
        <CCol xs={12} sm={4}>
        <DashboardCard 
                    title="Reorder Levels" 
                    subtitle="Total Medicine Reorder overview"
                    mainValue="5"
                    subValue="80%"
                    subValueLabel="Re-Order Rate"
                    icon={cilReload}
                />
        </CCol>
        <CCol xs={12} sm={6}>
            <CCard>
                <CCardHeader>
                <CRow>
                <CCol md={6}>Medicine Movements Analytics</CCol>
                <CCol md={6}>
                    <Select id="medicine" name="medicine" value={selecteMedicine} options={medicineOptions}  onChange={handleMedicineChange}  />
                </CCol>
                </CRow>
                    </CCardHeader>
                <CCardBody>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="Receiving" stroke="#28a745" activeDot={{ r: 10 }} />
                            <Line type="monotone" dataKey="Issuing" stroke="#ffbb28" activeDot={{ r: 5 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </CCardBody>
            </CCard>
        </CCol>
        <CCol xs={12} sm={6}>
            <CCard>
                <CCardHeader>
                   Medicine Stock Availability
                </CCardHeader>
                <CCardBody>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={pieData} cx="50%"  activeIndex={activeIndex} cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label onMouseEnter={onPieEnter}>
                                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28'][index % 3]} />)}
                            </Pie>
                            <Legend align="center" verticalAlign="bottom" layout="horizontal" />
                        </PieChart>
                    </ResponsiveContainer>
                </CCardBody>
            </CCard>
        </CCol>
        
    </CRow>
    <p></p>
    <CRow>
    <CCol xs={12} sm={6}>
        <CCard>
                <CCardHeader>
                  Top 5 Fast Moving Medicine Items
                </CCardHeader>
                <CCardBody>
                    <FastMovingItems items={fastMovingItems} />
                </CCardBody>
            </CCard>
        
        </CCol>
        <CCol xs={12} sm={6}>
        <CCard>
                <CCardHeader>
                  Top 5 Expiring Medicine Items
                </CCardHeader>
                <CCardBody>
                    <FastExpiringItems items={fastMovingItems} />
                </CCardBody>
            </CCard>
        
        </CCol>
    </CRow>
    <p></p>
    </>
            )

}

export default Dashboard;