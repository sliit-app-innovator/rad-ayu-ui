import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'

import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CFormInput,
    CFormLabel,
    CInputGroup,
    CInputGroupText,
    CRow,
    CSpinner,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CAlert,
    CFormTextarea,
    CCardTitle
} from '@coreui/react'
import DataTable from "react-data-table-component";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import swal from 'sweetalert';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import CIcon from '@coreui/icons-react'
import {
    cilTrash,
    cilPencil,
    cilPlus,
    cilSearch
} from '@coreui/icons'
import Select from 'react-select'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const StockInquiry = () => {



    const [Unit, setUnit] = React.useState('');
    const [ItemName, setItemName] = React.useState('');
    const [stores, setStores] = React.useState([]);
    const [store, setStore] = React.useState('');
    const [Qty, setQty] = React.useState(0);
    const [loading, setLoading] = React.useState(false)
    const axiosPrivate = useAxiosPrivate();
    const [validated, setValidated] = React.useState(false)
    const [data, setData] = useState([]);
    const [expandedRowData, setExpandedRowData] = useState(null);


    const [dataBill, setdataBill] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [editMode, setEditMode] = React.useState(false)
    const [searchMode, setEsearchMode] = React.useState(false)
    const [_id, setId] = React.useState('')
    const [user] = React.useState(localStorage.getItem("currentUser"))
    const [searchText, setSearch] = React.useState('')
    const [today] = useState(new Date());
    const [Lotvisible, setLotVisible] = React.useState(false)
    const [isLot, setIsLot] = React.useState(false)
    const [currentLot, setCurrentLot] = React.useState([{}])
    const [isExpire, setIsExpire] = React.useState(false)
    const [inputFields, setInputFields] = useState([])
    const [currentRow, setCurrentRow] = useState([])
    const [expandedRows, setExpandedRows] = useState([]);
    const [qtyError, setQtyError] = React.useState(false)

    const storeUrl = '/store'
    const medicineStock = '/stock/get-medicines-with-stock'
    const lotsCheckUrl = '/stock/lots-available'

    const columnsBill = useMemo(
        () => [
            {
                name: "Medicine Name",
                selector: row => row.name,
                sortable: true
            },
            {
                name: "Code",
                selector: row => row.code,
                sortable: true,
                width: "150px",
            },
            {
                name: "Medicine Type",
                selector: row => row.medicineTypeName,
                sortable: true,
                width: "150px",
            },
            {
                name: "Unit",
                selector: row => row.unitName,
                sortable: true,
                width: "150px",
            },
            {
                name: "Re-Order Level",
                selector: row => row.reorderLevel,
                sortable: true,
                width: "130px",
            },
            {
                name: "Qty",
                selector: row => row.quantity,
                sortable: true,
                width: "150px",
            },


        ]
    );

    const fetchStore = async () => {
        setLoading(true);
        let storesArray = [{ value: '', label: 'All Stores' }]
        const response = await axiosPrivate.get(
            storeUrl
        );
        await response.data.map((stores) => {
            return storesArray.push({ value: stores.id, label: stores.name });
        });

        setStores(storesArray)
        setLoading(false);

    }

    const customStyles = [
        {
            when: row => row.reorderLevel>0 && row.quantity<row.reorderLevel,
            style: {
              backgroundColor: '#f39c1994',
              fontSize: '16px', 
            },
          },
          {
            when: row => row.reorderLevel>0 && row.quantity>row.reorderLevel,
            style: {
              backgroundColor: '#2eb85c92',
              fontSize: '16px', 
            },
          },
    ]


    const fetchItems = async (page, searchValue = searchText, size = perPage, selectedStore = store) => {
        setLoading(true);
        const response = await axiosPrivate.get(medicineStock + `?page=${page}&per_page=${size}&search=${searchValue}`, {
            headers: { 'Content-Type': 'application/json', 'storeId': selectedStore?.value },
            withCredentials: true,
        });


        setData(response.data.data);
        setTotalRows(response.data.total);
        setLoading(false);
    };

    useEffect(() => {
        fetchStore()
        fetchItems(1)
    }, [currentPage, perPage, searchText]);

    const fetchRowData = async (row) => {
        const response = await axiosPrivate.get(lotsCheckUrl, {
            headers: { 'Content-Type': 'application/json', 'Itemid': row.id, 'Storeid': store?.value },
            withCredentials: true,
        });

        setExpandedRowData(response.data);

    }
    const handleRowExpandToggled = async (bool, row) => {
        setCurrentRow(row);
        if (bool) { // If the row is being expanded
            await fetchRowData(row);
        } else { // If the row is being collapsed
            setExpandedRowData(null); // Clear the data or handle as needed
        }
    };

    const ExpandComponentItem = (datas) =>
        <div>
            {expandedRowData?.length === 0 ? <CAlert color='default'>No Lots Available</CAlert> : <CCard>
                <CCardHeader>
                    <CCardTitle>
                        <span> <small>Lot Details </small> </span>
                    </CCardTitle>
                </CCardHeader>
                <CCardBody>

                    <table className='table   table-responsive  table-hover'>
                        <thead>
                            <tr>
                            <th> <small>Store </small></th>
                                <th> <small>Lot Number </small></th>
                                <th><small> Available Qty </small></th>
                                <th> <small> Expire Date</small> </th>
                                <th> <small> Received Date </small></th>
                            </tr>
                        </thead>
                        <tbody>
                            {expandedRowData?.map((lot, index) => {
                                return (

                                    <tr key={index}>

 <td>
                                            <small>  {lot.store}</small>
                                        </td>
                                        <td>
                                            <small>  {lot.lotNum}</small>
                                        </td>
                                        <td>
                                            <small>  {lot.quantity}</small>
                                        </td>

                                        <td>
                                            <small> {lot.expiryDate}</small>
                                        </td>
                                        <td>
                                            <small> {lot.purchaseDate}</small>
                                        </td>

                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>


                </CCardBody>
            </CCard>}


        </div >

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Stock Inquiries</strong>
                    </CCardHeader>
                    <CCardBody>

                        <CRow>
                            <CCol md={4}>
                                <Select options={stores} placeholder='Select Store for Filter' onChange={setStore} name='storeId' id='storeId' required={true} value={stores.find(a => a.value === store.value) ?? ''} />
                            </CCol>
                            <CCol md={6}>
                                <CFormInput type="text" placeholder="Enter Medicine Name to Search" value={searchText} onChange={(e) => setSearch(e.target.value)} />

                            </CCol>
                            <CCol xs={2} >
                                <CButton color='info' className='form-control' onClick={() => fetchItems(1)}><CIcon icon={cilSearch} /> Search</CButton>
                            </CCol>
                        </CRow>

                        <CRow>
                            <DataTable
                                columns={columnsBill}
                                data={data}
                                progressPending={loading}
                                pagination
                                expandableRowExpanded={(row) => (row === currentRow)}
                                expandOnRowClicked
                                onRowClicked={(row) => setCurrentRow(row)}
                                expandableRows
                                expandableRowsComponent={ExpandComponentItem}
                                onRowExpandToggled={(bool, row) => handleRowExpandToggled(bool, row)}
                                conditionalRowStyles={customStyles}
                            />
                        </CRow>

                        <CRow>
                            <CCol xs={2}>
                                <li className='legend'>d</li>
                            </CCol>
                        </CRow>

                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>





    )
}
export default StockInquiry