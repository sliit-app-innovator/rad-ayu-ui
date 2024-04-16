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
    CFormTextarea
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
// import ExpandComponentItem from './ExpandComponentItem';
// import ExpandComponentGrn from './ExpandComponentGrn';

const supplierUrl = '/supplier'
const itemsUrl = '/medicine'
const stockReceiveURL = '/stock/stock-receive'
const storeUrl = '/store'

const StockRetrieval = () => {

    const navigate = useNavigate()
    const inputRef = useRef(null);
    // Form Data 

    const [Item, setItem] = React.useState('');
    const [Unit, setUnit] = React.useState('');
    const [ItemName, setItemName] = React.useState('');
    const [code, setCode] = React.useState('');
    const [stores, setStores] = React.useState([]);
    const [Qty, setQty] = React.useState(0);
    const [loading, setLoading] = React.useState(false)
    const axiosPrivate = useAxiosPrivate();
    const [validated, setValidated] = React.useState(false)
    const [data, setData] = useState([]);
    const [dataBill, setdataBill] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [editMode, setEditMode] = React.useState(false)
    const [searchMode, setEsearchMode] = React.useState(false)
    const [_id, setId] = React.useState('')
    const [user] = React.useState(localStorage.getItem("currentUser"))
    const [searchText, setSearch] = React.useState('')
    const [today] = useState(new Date());
    const [Lotvisible, setLotVisible] = React.useState(false)
    const [isLot, setIsLot] = React.useState(false)
    const [isExpire, setIsExpire] = React.useState(false)
    const [inputFields, setInputFields] = useState([])
    const [currentRow, setCurrentRow] = useState([])
    const [expandedRows, setExpandedRows] = useState([]);
    const [qtyError, setQtyError] = React.useState(false)
    const [expirePopupErrors,setExpirePopupErrors] = React.useState('')


    const handleStoreChange = (selectedOption) => {
        setFormData(prev => ({ ...prev, storeId: selectedOption.value }));
    };

    const setpurchaseDateValue = (date) => {
        setFormData(prev => ({ ...prev, date: date }));
    }

    const [formData, setFormData] = useState({
        id: '',
        storeId: '',
        date: new Date(),
        source: '',
        requestBy: '',
        approvedBy: '',
        description: '',
        medicineList: []
    });

    const clear = async () => {
        setId('')
        setItem('')
        setItemName('')
        setCode('')
        setUnit('')
        setQty(0);
        setIsLot(false)
        setValidated(false)
        setEditMode(false)

        setFormData({
            id: '',
            storeId: '',
            date: new Date(),
            source: '',
            requestBy: '',
            approvedBy: '',
            description: '',
            medicineList: []
        });

    }


    const AddRow = async () => {

        if (!Item) {
            swal("Problem", "Please Select a Item", "warning");
            return false
        }

        if (Qty === 0 || !Qty) {
            swal("Problem", "Please Enter Qty", "warning");
            return false
        }

        if (isExpire) {
            let exObj = [{ expireQty: Qty, expireDate: '' }];
            if (editMode) {
                exObj = inputFields
            }
            setInputFields(exObj)
            setLotVisible(true)

        } else {
            addItemToGrid()
        }

    }

    const addItemToGrid = async () => {
        // debugger
        let dataset = { id: Item, code: code, unit: Unit, name: ItemName, qty: Qty, lots: inputFields, isExpire: isExpire }
        let totData = [];
        if (editMode) {
            let filteredData = dataBill.filter(a => a.id !== Item);
            totData = [...filteredData, dataset]
            setdataBill(totData)
        } else {

            const selectedDate = dataBill.find(a => a.id === Item);
            if (selectedDate) {
                swal("Validation", "Medicine Already Exist in the list", "warning");
                return false;
            }
            totData = [...dataBill, dataset]
            setdataBill(totData)

        }
        console.log(dataBill);
        setId('')
        setItem('')
        setItemName('')
        setCode('')
        setUnit('')
        setQty(0);
        setLotVisible(false)
        setIsLot(false)
        setIsExpire(false)
        setEditMode(false)
        setInputFields([])
    }

    const setExpireDatesValues = async () => {
        setQtyError(false)
        let data = [...inputFields];
        let qtySum = data.map(o => Number(o.expireQty)).reduce((a, c) => { return a + c });
        const hasEmptyExpireDates = data.some(o => o.expireDate === '' || o.expireQty === '');
        console.log('sum value', qtySum);



        if (qtySum != Qty) {
            setExpirePopupErrors('Qty and Expire Dates are not Equal')
            setQtyError(true)
        } else if (hasEmptyExpireDates) {
            setExpirePopupErrors('Please Enter Expire Dates')
            setQtyError(true)
        }else{
            addItemToGrid()
        }
    }

    const checkValidity = async () => {
        if (!formData.storeId) {
            return { status: false, message: 'Please Select Store' };
        }

        if (!formData.source) {
            return { status: false, message: 'Please Enter Stock Retrieve Source' };
        }

        return { status: true };
    }

    const handleDeleteExpireField = async (index) => {
        let data = [...inputFields];
        data.splice(index, 1);
        setInputFields(data);
    }
    const handleAddNewExpireField = async (index) => {
        let newEpDate = { expireQty: '1', expireDate: '' }
        let data = [...inputFields];
        data.push(newEpDate);
        setInputFields(data);
    }
    const handleFormChange = (index, event, elementName) => {
        let data = [...inputFields];
        if (elementName === 'expireQty') {
            event = event.target.value;
        }
        if (elementName === 'expireDate') {
            let dates = new Date(event);
            let dd = dates.getFullYear() + '-' + (dates.getMonth() + 1).toString().padStart(2, '0') + '-' + dates.getDate().toString().padStart(2, '0');
            event = dd;
        }

        data[index][elementName] = event;
        setInputFields(data);
        console.log(inputFields);
    }

    const handleSubmit = async (event) => {
        console.log(event);
        event.preventDefault()
        let validate = await checkValidity();
        if (validate.status === false) {
            event.stopPropagation()
            swal("Validation", validate.message, "warning");
            return false
        }
        setValidated(true)
        setLoading(true);
        formData['medicineList'] = dataBill;
        submitForm(formData, event)
    }


    const handleCloseModal = async () => {
        setLotVisible(false)
        console.log('received expire list');
    }

    const submitForm = async (data, event) => {
        try {
            let response = {};
            response = await axiosPrivate.post(stockReceiveURL, JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });
            if (response.data.status === true) {
                swal("Success", "Purchase Generated Successfully !", "success");
                setValidated(false)
                resetPage()

            } else {
                swal("Problem", response.data.message, "error");
            }

        } catch (err) {
            console.log(err);
            swal("Problem", err.response.data.message, "error");
        } finally {
            setLoading(false);
        }
    }

    const fetchItems = async (page, searchValue = searchText, size = perPage, store) => {

        const response = await axiosPrivate.get(
            itemsUrl + `/search-pagination?page=${page}&per_page=${size}&search=${searchValue}`
        );
        setData(response.data.data);
        setTotalRows(response.data.total);
    };

    const fetchStore = async () => {
        setLoading(true);
        let storesArray = []
        const response = await axiosPrivate.get(
            storeUrl
        );
        await response.data.map((stores) => {
            return storesArray.push({ value: stores.id, label: stores.name });
        });

        setStores(storesArray)
        setLoading(false);

    }

    useEffect(() => {
        fetchStore()
        fetchItems(1)
    }, []);



    const resetPage = async (items) => {
        setdataBill([])
        fetchItems(1)
        clear()
        setSearch('')
    }
    const handleClear = useCallback(
        row => async () => {
            swal({
                title: "Are you sure?",
                text: "You want to Reset This Form Data ?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then(async (willDelete) => {
                    if (willDelete) {
                        resetPage()
                    }
                });
        }, []

    );

    const handleDelete = useCallback(
        row => async () => {
            swal({
                title: "Are you sure?",
                text: "You want to remove this Item from Bill ?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then(async (willDelete) => {
                    if (willDelete) {
                        let filteredData = dataBill.filter(a => a.id !== row.id)
                        setdataBill(filteredData)
                    }
                });
        }, [dataBill]

    );


    const handleEditBillItem = useCallback(
        row => async () => {
            setEditMode(true)
            setItem(row.id)
            setItemName(row.name)
            setCode(row.code)
            setQty(row.qty)
            setUnit(row.unit)
            setIsExpire(row.isExpire)
            setIsLot(row.isLot)
            if (row.Lot) {
                setInputFields(row.Lot)
            }

            const element = document.getElementById('ItemName');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'end' });
                element.focus()
                setEsearchMode(false);
                inputRef.current.select();
            }
            if (row.lots.length > 0) {
                setInputFields(row.lots)
            }

        },
        [currentPage, perPage, totalRows]
    );


    const handleEdit = useCallback(
        row => async () => {
            setItem(row.id)
            setItemName(row.name)
            setCode(row.code)
            setUnit(row.uname)
            setQty(1)
            setIsExpire(row.isExpire)
            const element = document.getElementById('Qty');
            element.focus()
            setEsearchMode(false);
            console.log('is Lot', isLot);
        },
        [dataBill]
    );



    const columns = useMemo(
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
                name: "Unit",
                selector: row => row.uname,
                sortable: true,
                width: "150px",
            },


            {
                name: "Action",
                width: "80px",
                cell: row => <div><button type='button' className='btn btn-success small' onClick={handleEdit(row)}><CIcon icon={cilPlus} /></button> </div>

            }
        ],
        [handleDelete, handleEdit]
    );


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
                name: "Unit",
                selector: row => row.unit,
                sortable: true,
                width: "150px",
            },

            {
                name: "Qty",
                selector: row => row.qty,
                sortable: true,
                width: "150px",
            },

            {
                name: "Action",
                width: "120px",
                cell: row => <div><button type='button' className='btn btn-warning small' onClick={handleEditBillItem(row)}><CIcon icon={cilPencil} /></button> <button className='btn btn-danger small ' type='button' onClick={handleDelete(row)}><CIcon icon={cilTrash} style={{ color: 'white' }} /></button></div>

            }
        ]
    );
    const handlePageChange = async (page) => {
        console.log(page);
        setCurrentPage(page);
        fetchItems(page);
    };

    const filterHandler = search => {
        setEsearchMode(true);
        setSearch(search)
        fetchItems(1, search)
    }
    const SearchModeFn = value => {
        setEsearchMode(!searchMode);
    }
    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
        fetchItems(page, searchText, newPerPage);
        console.log(page, searchText, newPerPage)
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    // const ExpandedComponent = (datas) => <pre> {JSON.stringify(datas, null, 2)}</pre>



    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Stock Retrieval</strong>
                    </CCardHeader>
                    <CCardBody>
                        <CForm className="row g-3 needs-validation" validated={validated} onSubmit={handleSubmit}>
                            {/* <pre>{JSON.stringify(dataBill, null, 2)}  </pre> */}
                            <CRow>
                                <CCol md={6}>
                                    <CFormInput type="hidden" id="user" name='user' value={user} />
                                    <CFormLabel htmlFor="Store">Store</CFormLabel>
                                    <Select options={stores} onChange={handleStoreChange} name='storeId' id='storeId' required={true} value={stores.find(a => a.value === formData.storeId) ?? ''} />
                                </CCol>
                                <CCol md={4} />

                                <CCol md={2}>
                                    <CFormLabel htmlFor="Name">Date</CFormLabel>
                                    <DatePicker maxDate={today} name='date' style={{ textAlign: 'right' }} className='form-control text-right' selected={formData.date} onChange={(date) => setpurchaseDateValue(date)} required={true} />
                                </CCol>


                            </CRow>
                            <CRow>
                                <CCol md={6}>
                                    <CFormLabel htmlFor="Source">Source</CFormLabel>
                                    <CFormInput type="text" id="source" name="source" required value={formData.source} onChange={handleChange} />
                                </CCol>
                                <CCol md={6}>
                                    <CFormLabel htmlFor="requestBy">Request By</CFormLabel>
                                    <CFormInput type="text" id="requestBy" name="requestBy" required value={formData.requestBy} onChange={handleChange} />
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol md={6}>
                                    <CFormLabel htmlFor="approved_by">Approved By</CFormLabel>
                                    <CFormInput type="text" id="approvedBy" name="approvedBy" required value={formData.approvedBy} onChange={handleChange} />
                                </CCol>
                            </CRow>

                            <CCard className="mb-5">
                                <CCardHeader>Medicine for Retrieve</CCardHeader>
                                <CCardBody>
                                    <CRow>
                                        <CCol xs={6} ></CCol>
                                        <CCol xs={6} >
                                            <CInputGroup className="mb-3">

                                                <CInputGroupText onClick={(e) => SearchModeFn(true)}>
                                                    <CIcon icon={cilSearch} />
                                                </CInputGroupText>

                                                <CFormInput
                                                    placeholder=" Search "
                                                    id="search" value={searchText}
                                                    onChange={(e) => filterHandler(e.target.value)}
                                                />
                                            </CInputGroup>
                                        </CCol>
                                    </CRow>

                                    {searchMode && (
                                        <DataTable
                                            columns={columns}
                                            data={data}
                                            progressPending={loading}
                                            pagination
                                            paginationServer
                                            paginationTotalRows={totalRows}
                                            paginationDefaultPage={currentPage}
                                            onChangeRowsPerPage={handlePerRowsChange}
                                            onChangePage={handlePageChange}
                                        // expandableRows
                                        // expandableRowsComponent={ExpandComponentItem}

                                        />)}
                                </CCardBody>
                            </CCard>

                            <CCol md={5}>
                                <CFormLabel htmlFor="ItemName">Medicine</CFormLabel>
                                <CFormInput type="hidden" id="Item" name="Item" value={Item} />
                                <CFormInput type="text" id="ItemName" name="ItemName" value={ItemName} disabled={true} />
                            </CCol>
                            <CCol md={2}>
                                <CFormLabel htmlFor="Code">Code</CFormLabel>
                                <CFormInput type="text" id="Code" value={code} disabled={true} />
                            </CCol>
                            <CCol md={2}>
                                <CFormLabel htmlFor="Unit">Unit</CFormLabel>
                                <CFormInput type="text" id="Unit" value={Unit} disabled={true} />
                            </CCol>
                            <CCol md={2}>
                                <CFormLabel htmlFor="Qty">Qty</CFormLabel>
                                <CFormInput type="number" id="Qty" name="Qty" value={Qty} onChange={async event => {
                                    setQty(event.target.value);
                                }} ref={inputRef} />
                            </CCol>

                            <CCol md={1}>
                                <CFormLabel htmlFor="small">Add to List</CFormLabel>
                                {!editMode && (<CButton type='button' className='btn btn-info small' onClick={() => AddRow()}><CIcon icon={cilPlus} /></CButton>)}
                                {editMode && (<CButton type='button' className='btn btn-warning small' onClick={() => AddRow()}><CIcon icon={cilPencil} /></CButton>)}
                            </CCol>
                            <CRow>
                                <DataTable
                                    columns={columnsBill}
                                    data={dataBill}
                                    progressPending={loading}
                                    pagination
                                    expandableRowExpanded={(row) => (row === currentRow)}
                                    expandOnRowClicked
                                    onRowClicked={(row) => setCurrentRow(row)}
                                // expandableRows
                                // expandableRowsComponent={ExpandComponentGrn}
                                // onRowExpandToggled={(bool, row) => setCurrentRow(row)}

                                />
                            </CRow>
                            <p></p>
                            <CRow>
                                <CCol md={12}>
                                    <CFormLabel htmlFor="Code">Remarks</CFormLabel>
                                    <CFormTextarea type="text" id="description" name="description" value={formData.description} onChange={handleChange} />
                                </CCol>
                            </CRow>

                            <p></p>
                            <CRow>
                                <CCol xs={3} >
                                    {loading ? (
                                        <CSpinner color="primary" variant="grow" />
                                    ) : (
                                        <CButton color="primary form-control" type="submit" name='BtnSave' >
                                            Submit Stock Retrieval
                                        </CButton>

                                    )}
                                </CCol>
                                <CCol xs={2}>
                                    {loading ? (
                                        <CSpinner color="primary" variant="grow" />
                                    ) : (
                                        <CButton color="danger form-control" type="button" onClick={handleClear({})} >
                                            Reset
                                        </CButton>
                                    )}
                                </CCol>

                            </CRow>

                        </CForm>
                        <p></p>
                        <CRow>
                            <CModal size="lg" visible={Lotvisible} onClose={handleCloseModal}   >
                                <CModalHeader>
                                    <CModalTitle>
                                        <CCardHeader>
                                            <strong>Expire Dates  For</strong> <small>{ItemName}</small>
                                        </CCardHeader>
                                    </CModalTitle>


                                </CModalHeader>
                                <CModalBody>
                                    <table className='table'>
                                        <thead>
                                            <tr>
                                                <th><CFormLabel htmlFor="expireQty">Qty</CFormLabel></th>
                                                <th><CFormLabel htmlFor="expireDate">Expire Date</CFormLabel></th>
                                                <th><CButton type='button' className='btn btn-success  bg-green' onClick={() => handleAddNewExpireField()}><CIcon icon={cilPlus} /></CButton></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {inputFields.map((input, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>
                                                            <CFormInput type="number" name="expireQty" value={inputFields[index].expireQty} onChange={event => handleFormChange(index, event, 'expireQty')} />
                                                        </td>

                                                        <td>
                                                            <DatePicker minTime={today} style={{ textAlign: 'right' }} value={inputFields[index].expireDate} name="expireDate" dateFormat='yyyy-MM-dd' className='form-control text-right' onChange={(event) => handleFormChange(index, event, 'expireDate')} required={true} />

                                                        </td>
                                                        <td>
                                                            <CButton type='button' className='btn btn-danger small' onClick={() => handleDeleteExpireField(index)}><CIcon icon={cilTrash} /></CButton>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>

                                    <p>

                                    </p>
                                    <CRow>
                                        <CCol lg={10}>
                                            {qtyError ?
                                                (
                                                    <CAlert color="danger">
                                                        {expirePopupErrors}
                                                    </CAlert>
                                                ) : (<p></p>)
                                            }

                                        </CCol>
                                        <CCol lg={2}>
                                            <CButton color="btn btn-success form-control" type="button" onClick={() => setExpireDatesValues()} >
                                                Done
                                            </CButton>
                                        </CCol>
                                    </CRow>




                                </CModalBody>

                            </CModal>
                        </CRow >
                    </CCardBody>

                </CCard>
            </CCol>
        </CRow >

    )
}

export default StockRetrieval
