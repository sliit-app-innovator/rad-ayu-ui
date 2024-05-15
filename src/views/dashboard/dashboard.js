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
    const [pieData,setPieData] = useState([]);
    const [fastMovingItems,setFastMovingItems] = useState([]);
    const [fastExpiringItems,setFastExpiringItems] = useState([]);
    const [medicineMovement, setMedicineMovement] = useState([]);
    const [requisitions, setRequisitions] = useState(0);
    const [requisitionCR, setRequisitionCR] = useState(0);

    const [pendingReorder, setPendingReorder] = useState(0);
    const [reOrderRate, setReOrderRate] = useState(0);

    useEffect(() => {
        fetcInitialData()
    }, []);

    
    const dashbordUrl = '/dashboard';
    const medicineUri = '/medicine';
const fetcInitialData = async (id) => {
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
        let medicineId = id;
        if(id == undefined){
            medicineId = medicineList[0].value;
        } 

        const dashboardData = await axiosPrivate.get(dashbordUrl+"/"+medicineId);
        console.log(dashboardData.data);
        setPieData(dashboardData.data.medicineStockChart);
        setFastMovingItems(dashboardData.data.top5FastMovingMedicines)
        setMedicineMovement(dashboardData.data.medicineMovement);
        setFastExpiringItems(dashboardData.data.top5ExpiringMedicines)

        
        setRequisitions(dashboardData.data.stockRequsitions.pending);
        setRequisitionCR(dashboardData.data.stockRequsitions.completedRate);

        const pendingReorder = dashboardData.data.reorderLevels.pending;
        const total = dashboardData.data.reorderLevels.total;
        const rate = (pendingReorder/total)*100;

        setReOrderRate(rate);
        setPendingReorder(pendingReorder);




    } catch (error) {
        medicineList = [];
 
    }
    setLoading(false);
};

    const [activeIndex, setActiveIndex] = React.useState(0)
     
    
    const onPieEnter = (data, index) => {
        setActiveIndex(index);
    }

    const handleMedicineChange = (selectedOption) => {
        setSelecteMedicine(selectedOption);
        fetcInitialData(selectedOption.value)
    };


    return (
        <>
        <CRow>
        <CCol xs={12} sm={4}>
        <DashboardCard 
                    title="Stock Requisitions" 
                    subtitle="Total requisitions overview"
                    mainValue={requisitions}
                    subValue={requisitionCR}
                    subValueLabel="Completed Rate"
                    icon={cilRoom}
                />
        </CCol>
        <CCol xs={12} sm={4}>
        <DashboardCard 
                    title="Medicine Productions" 
                    subtitle="Total Production overview"
                    mainValue="10"
                    subValue="85"
                    subValueLabel="Production Rate"
                    icon={cilStream}
                />
        </CCol>
        <CCol xs={12} sm={4}>
        <DashboardCard 
                    title="Reorder Levels" 
                    subtitle="Total Medicine Reorder overview"
                    mainValue={pendingReorder}
                    subValue={reOrderRate}
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
                    <Select id="medicine" name="medicine" value={selecteMedicine} options={medicineOptions}  onChange={(selected) => handleMedicineChange(selected)}  />
                </CCol>
                </CRow>
                    </CCardHeader>
                <CCardBody>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={medicineMovement}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="receiving" stroke="#28a745" activeDot={{ r: 10 }} />
                            <Line type="monotone" dataKey="issueing" stroke="#ffbb28" activeDot={{ r: 5 }} />
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
                            <Pie data={pieData} cx="50%"  activeIndex={activeIndex} cy="50%" outerRadius={80} fill="#8884d8" dataKey="availableStock" label onMouseEnter={onPieEnter}>
                                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28'][index % pieData.length]} />)}
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
                    <FastExpiringItems items={fastExpiringItems} />
                </CCardBody>
            </CCard>
        
        </CCol>
    </CRow>
    <p></p>
    </>
            )

}

export default Dashboard;