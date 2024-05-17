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
    cilSearch,
    cilCloudDownload
} from '@coreui/icons'
import Select from 'react-select'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const requestUrl = '/get-pending-requests'
const requestByIdUrl = '/stock-requisition'
const itemsUrl = '/medicine'
const stockUrl = '/stock'
const storeUrl = '/store'
const transferUrl = '/stock-transfer'

const StockTransfer = () => {

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
    const [orderRequestList, setOrderRequestList] = useState([]);

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
    const [requestVisible, setRequestVisible] = React.useState(false)
    const [isLot, setIsLot] = React.useState(false)
    const [currentLot, setCurrentLot] = React.useState([{}])
    const [isExpire, setIsExpire] = React.useState(false)
    const [inputFields, setInputFields] = useState([])
    const [currentRow, setCurrentRow] = useState([])
    const [expandedRows, setExpandedRows] = useState([]);
    const [requestedItemList,setRequestedItemList]=useState([]);
    const [qtyError, setQtyError] = React.useState(false)
    const [lotsErrors, setLotsErrors] = React.useState('')
    const [singleLot,setSingleLot]=React.useState(false)


    const [fromStores, setFromStores] = useState([]);
    const [toStores, setToStores] = useState([]);


    const handleFromStoreChange = (selectedOption) => {
        localStorage.setItem('store', selectedOption.value);
        setFormData(prev => ({ ...prev, fromStore: selectedOption.value }));
        setToStores(stores.filter(a => a.value !== selectedOption.value));
    };

    const handleToStoreChange = (selectedOption) => {
        setFormData(prev => ({ ...prev, toStore: selectedOption.value }));
        setFromStores(stores.filter(a => a.value !== selectedOption.value));
    };


    const [issueTypes, setIssueTypes] = useState([
        { label: 'Ward', value: '0' },
        { label: 'OPT', value: '1' },
    ]);

    const handleIssueChange = (selectedOption) => {
        setFormData(prev => ({ ...prev, issueType: selectedOption.value }));
    }

    const handleStoreChange = (selectedOption) => {
        setFormData(prev => {
            const updatedFormData = { ...prev, storeId: selectedOption.value };
            localStorage.setItem('store', selectedOption.value);
            return updatedFormData;
        });
    };

    const setpurchaseDateValue = (date) => {
        setFormData(prev => ({ ...prev, date: date }));
    }

    const [formData, setFormData] = useState({
        id: '',
        requestNo:'',
        fromStore: '',
        toStore: '',
        requestBy: '',
        approvedBy: '',
        date: new Date(),
        description: '',
        items: []
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
            requestNo:'',
            fromStore: '',
            toStore: '',
            requestBy: '',
            approvedBy: '',
            date: new Date(),
            description: '',
            items: []
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
        const addedLots = currentLot.filter(a => a.issueQty > 0);
        let dataset = { id: Item, code: code, unit: Unit, name: ItemName, qty: Qty, lots: addedLots, isLot: isLot }
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

    const calculateTotalQty = async () => {
        let qtySum = currentLot.map(o => Number(o.issueQty)).reduce((a, c) => { return a + c });
        if (qtySum > 0) {
            setQty(qtySum)
        }
    }
    const setIssueMedicineQty = async () => {
        setQtyError(false)
        if(currentLot.length===0){
            setLotsErrors('no Lots Available for this Medicine')
            setQtyError(true)
            return false
        }

        let qtySum = currentLot.map(o => Number(o.issueQty)).reduce((a, c) => { return a + c });
        if (qtySum === 0) {
            setQtyError(true)
            setLotsErrors('Please Enter Issue Qty')
            return false
        }  

        const problematicLots = currentLot.filter(o => o.issueQty > o.quantity);
        if (problematicLots.length > 0) {
            setQtyError(true)
            setLotsErrors('Issue Qty is Greater than Available Qty')
            return false
        }

        

        
        setQty(qtySum)
        addItemToGrid()
         
    }

    const checkValidity = async () => {
        if (!formData.fromStore) {
            return { status: false, message: 'Please Select From Store' };
        }
        if (!formData.toStore) {
            return { status: false, message: 'Please Select To Store' };
        }
        if (!formData.requestBy) {
            return { status: false, message: 'Please Enter Request By' };
        }
        if (!formData.approvedBy) {
            return { status: false, message: 'Please Enter Approved By' };
        }

        if (dataBill.length === 0) {
            return { status: false, message: 'Please Add Medicine to List' };
        }
        return { status: true };
    }

    const handleSelectLot = async (index) => {
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

    const loadRequests = async () => {
        setLoading(true)
        const response = await axiosPrivate.get(
            requestUrl 
        );
        
        setOrderRequestList(response.data);
        setRequestVisible(true)
        setLoading(false)
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

        const itemList = dataBill.map((item) => {
            console.log(item)
            return { medicine_id: item.id, qty: item.qty, isLot:item.isLot, lots: item.lots }
        })

        formData['items'] = itemList;
        formData['from_store'] = formData.fromStore;
        formData['to_store'] = formData.toStore;
        formData['requested_by'] = formData.requestBy;
        formData['approved_by'] = formData.approvedBy;
        formData['description'] = formData.description;
        formData['status'] = 'NEW';
        submitForm(formData, event)
    }


    const handleCloseModal = async () => {
        setLotVisible(false)
        console.log('received expire list');
    }

    const loadRequestNumber = async (id,requestedBy,from,to) => {
        setFormData(prev => ({ ...prev, requestNo: id }));
        setFormData(prev => ({ ...prev, requestBy: requestedBy }));
 
        setFormData(prev => ({ ...prev, fromStore: from }));
        setFormData(prev => ({ ...prev, toStore: to }));
        const response = await axiosPrivate.get(
            requestByIdUrl + `/${id}`
        );
        setRequestedItemList(response.data);
        setRequestVisible(false)
         
    }

    const getStoreNameById = (id) => {  
        let store = stores.find(a => a.value === id);
        return store ? store.label : '';
    }
    const handleCloseRequestModal = async () => {
        setRequestVisible(false)
    }

    const submitForm = async (data, event) => {
        try {
            let response = {};
            response = await axiosPrivate.post(`${transferUrl}`, JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });
            if (response.data && response.data.id && Number(response.data.id) >0 ) {
                swal("Success", "Medicine Transfered Successfully !", "success");
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
        setFromStores(storesArray)
        setToStores(storesArray)
        setLoading(false);

    }

    useEffect(() => {
        fetchStore()
        fetchItems(1)
    }, [formData.storeId, currentPage, perPage, searchText]);



    const resetPage = async (items) => {
        setdataBill([])
        setRequestedItemList([])
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


            const element = document.getElementById('ItemName');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'end' });
                element.focus()
                setEsearchMode(false);
                inputRef.current.select();
            }
            if (row.lots.length > 0) {
                debugger
                let Clots = await getAvailableLots(row.id);
                console.log('ddddddd')
                console.log(Clots)
                if (Clots.length > 0) {
                    Clots.forEach(element => {
                        row.lots.forEach(rl => {
                            if (rl.lotId === element.lotId) {
                                element.issueQty = rl.issueQty
                            }
                        })
                        // element.issueQty = 0
                    });
                    setCurrentLot(Clots)
                    setLotVisible(true)
                }
            }
        },
        [currentPage, perPage, totalRows]
    );


    const getAvailableLots = async (id) => {
        setCurrentLot([])
        setIsLot(false)
        setLoading(true)
        const selectedStore = localStorage.getItem('store');
        if (!selectedStore) {
            swal("Problem", "Please Select Store First", "warning");
            return false
        }

        const url = `${stockUrl}/lots-available`


        let response = {};
        response = await axiosPrivate.get(url, {
            headers: { 'Content-Type': 'application/json', storeId: selectedStore, itemId: id },
            withCredentials: true,
        });

        debugger
        if (response.data.status === true) {
            const { data } = response.data;
            if (data.length > 0) {
                setIsLot(true)
                setQty(0)
                setCurrentLot(data);
            }
        }
        setLoading(false)
        return response.data;
    }

    const handleEdit = useCallback(
        row => async () => {
            setSingleLot(false)
            const data = await getAvailableLots(row.id);
            setCurrentLot(data)
            console.log('this is received data')
            console.log(data)
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
             
            if (data && data.length > 0) {
                setLotVisible(true)
                setIsLot(true)
                setQty(0)
            }
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

    const handleIssueQtyChange = async (index, e) => {
        const updatedLots = [...currentLot];
        updatedLots[index].issueQty = e.target.value;
        setCurrentLot(updatedLots);
        let qtySum = currentLot.map(o => Number(o.issueQty ?? 0)).reduce((a, c) => { return a + c });
        console.log('calculating sum of qty', qtySum)
        if (qtySum > 0) {
            setQty(qtySum)
        }
    }

    const ExpandComponentItem = (datas) =>
        <div>
            <CCard>
                <CCardHeader>
                    <CCardTitle>
                        <span>Lot Information   </span>   -    {datas.data.name}
                    </CCardTitle>
                </CCardHeader>
                <CCardBody>
                    {/* <pre>{JSON.stringify(datas.data, null, 2)}</pre> */}
                    <table className='table   table-responsive  table-hover'>
                        <thead>
                            <tr>
                                <th><CFormLabel htmlFor="lotNumber">Lot Number</CFormLabel></th>
                                <th><CFormLabel htmlFor="issue">Issue Qty</CFormLabel></th>
                                <th><CFormLabel htmlFor="expireDate">Expire Date</CFormLabel></th>
                                <th><CFormLabel htmlFor="receivedDate">Received Date</CFormLabel></th>
                            </tr>
                        </thead>
                        <tbody>
                            {datas.data.lots?.map((lot, index) => {
                                return (

                                    <tr key={index}>

                                        <td>
                                            {lot.lotNum}
                                        </td>
                                        <td>
                                            {lot.issueQty}
                                        </td>

                                        <td>
                                            {lot.expiryDate}
                                        </td>
                                        <td>
                                            {lot.purchaseDate}
                                        </td>

                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>


                </CCardBody>
            </CCard>

        </div >

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Medicine Transfer</strong>
                    </CCardHeader>
                    <CCardBody>
                        <CForm className="row g-3 needs-validation" validated={validated} onSubmit={handleSubmit}>
                            {/* <pre>{JSON.stringify(dataBill, null, 2)}  </pre> */}
                            <CRow>
                                <CCol md={4}>
                                    <CFormLabel htmlFor="requestNo">Request No</CFormLabel>
                                    <CFormInput type="text" id="requestNo" name="requestNo" readOnly required value={formData.requestNo} onChange={handleChange} />
                                   
                                </CCol>
                                <CCol md={1}>
                                    <CFormLabel htmlFor="requestNo">Search</CFormLabel>
                                    <CButton className='inline'onClick={(e) => loadRequests()}  ><CIcon icon={cilSearch}></CIcon></CButton>
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol md={5}>
                                    <CFormInput type="hidden" id="user" name='user' value={user} />
                                    <CFormLabel htmlFor="Store">From Store</CFormLabel>
                                    <Select options={fromStores} onChange={handleFromStoreChange} name='fromStore' id='fromStore' required={true} value={stores.find(a => a.value === formData.fromStore) ?? ''} />
                                </CCol>
                                <CCol md={5} >
                                    <CFormLabel htmlFor="toStore">To Store</CFormLabel>
                                    <Select options={toStores} onChange={handleToStoreChange} name='toStore' id='toStore' required={true} value={stores.find(a => a.value === formData.toStore) ?? ''} />
                                </CCol>


                                <CCol md={2}>
                                    <CFormLabel htmlFor="Name">Date</CFormLabel>
                                    <DatePicker maxDate={today} name='date' style={{ textAlign: 'right' }} className='form-control text-right' selected={formData.date} onChange={(date) => setpurchaseDateValue(date)} required={true} />
                                </CCol>


                            </CRow>
                            <CRow>
                                
                                <CCol md={6}>
                                    <CFormLabel htmlFor="requestBy">Request By</CFormLabel>
                                    <CFormInput type="text" id="requestBy" name="requestBy" required value={formData.requestBy} onChange={handleChange} />
                                </CCol>
                                <CCol md={6}>
                                    <CFormLabel htmlFor="approved_by">Approved By</CFormLabel>
                                    <CFormInput type="text" id="approvedBy" name="approvedBy" required value={formData.approvedBy} onChange={handleChange} />
                                </CCol>
                            </CRow>

                            <CCard className="mb-5">
                                <CCardHeader className='info'>Requested Medicine Details</CCardHeader>
                                <CCardBody> 
                                <table className='table   table-responsive  table-hover'>
                        <thead>
                            <tr>
                                <th><CFormLabel htmlFor="lotNumber">Medicine</CFormLabel></th>
                                <th><CFormLabel htmlFor="issue">Ask Qty</CFormLabel></th>
                            </tr>
                        </thead>
                        <tbody>
                            {requestedItemList?.items?.map((item, index) => {
                                return (

                                    <tr key={index}>

                                        <td>
                                            {item.name}
                                        </td>
                                        <td>
                                            {item.qty}
                                        </td>

                                       

                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>

                                </CCardBody>
                            </CCard>
                            


                            <CCard className="mb-5">
                                <CCardHeader>Select Medicine For Transfer</CCardHeader>
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
                                    expandableRows
                                    expandableRowsComponent={ExpandComponentItem}
                                    onRowExpandToggled={(bool, row) => setCurrentRow(row)}

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
                                <CCol xs={7} ></CCol>
                                <CCol xs={3} >
                                    {loading ? (
                                        <CSpinner color="primary" variant="grow" />
                                    ) : (
                                        <CButton color="primary form-control" type="submit" name='BtnSave' >
                                            Transfer Medicines
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
                                            <strong>Available Lots For</strong> <small>{ItemName}</small>
                                        </CCardHeader>
                                    </CModalTitle>


                                </CModalHeader>
                                <CModalBody>
                                    {/* <pre>{JSON.stringify(currentLot, null, 2)}</pre> */}
                                    {/* {Qty} */}
                                    <table className='table   table-responsive  table-hover'>
                                        <thead>
                                            <tr>
                                                <th><CFormLabel htmlFor="expireQty">Available</CFormLabel></th>
                                                <th><CFormLabel htmlFor="issue">Issue Qty</CFormLabel></th>
                                                <th><CFormLabel htmlFor="lotNumber">Lot Number</CFormLabel></th>
                                                <th><CFormLabel htmlFor="expireDate">Expire Date</CFormLabel></th>
                                                <th><CFormLabel htmlFor="receivedDate">Received Date</CFormLabel></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* <pre>{JSON.stringify(currentLot, null, 2)}</pre> */}

                                            {currentLot.map((lot, index) => {
                                                return (

                                                    <tr key={index}>
                                                        {/* <pre>{JSON.stringify(lot, null, 2)}</pre> */}
                                                        <td>
                                                            <button type="button" class="btn btn-success">
                                                                <span class="badge badge-light">{lot.quantity}</span>
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <CFormInput type="number" id="issueQty" value={lot.issueQty} onChange={event => handleIssueQtyChange(index, event)} />
                                                        </td>
                                                        <td>
                                                            {lot.lotNum}
                                                        </td>
                                                        <td>
                                                            {lot.expiryDate}
                                                        </td>
                                                        <td>
                                                            {lot.purchaseDate}
                                                        </td>

                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>

                                    <p>
                                        <CRow>
                                            <CCol lg={6}>
                                                {qtyError ?
                                                    (
                                                        <CAlert color="danger">
                                                            {lotsErrors}
                                                        </CAlert>
                                                    ) : (<p></p>)
                                                }

                                            </CCol>
                                            <CCol lg={4}> <CAlert className='info'>Issuing Qty : <strong>{Qty}</strong>   </CAlert></CCol>
                                            <CCol lg={2}>

                                                <CButton color="btn btn-primary form-control" type="button" onClick={() => setIssueMedicineQty()} >
                                                    Done
                                                </CButton>
                                            </CCol>
                                        </CRow>


                                    </p>
                                    {/* <pre>{JSON.stringify(currentLot, null, 2)}</pre> */}
                                </CModalBody>

                            </CModal>
                        </CRow >


  {/* Model For Search Request */}
                        <CRow>
                            <CModal size="xl" visible={requestVisible} onClose={handleCloseRequestModal}   >
                                <CModalHeader>
                                    <CModalTitle>
                                        <CCardHeader>
                                            <strong>Pending Medicine Requests</strong> <small>{ItemName}</small>
                                        </CCardHeader>
                                    </CModalTitle>


                                </CModalHeader>
                                <CModalBody>
                                     
                                    <table className='table   table-responsive  table-hover'>
                                        <thead>
                                            <tr>
                                                <th><CFormLabel htmlFor="issue">No</CFormLabel></th>
                                                <th><CFormLabel htmlFor="Reference">Reference</CFormLabel></th>
                                                <th><CFormLabel htmlFor="expireQty">Requested Date</CFormLabel></th>
                                                <th><CFormLabel htmlFor="issue">Requested By</CFormLabel></th>
                                                <th><CFormLabel htmlFor="lotNumber">From Store</CFormLabel></th>
                                                <th><CFormLabel htmlFor="expireDate">To Store</CFormLabel></th>
                                                <th><CFormLabel htmlFor="action">Action</CFormLabel></th>
                                                
                                            </tr>
                                        </thead>
                                        <tbody>
                                            

                                            {orderRequestList?.map((lot, index) => {
                                                return (

                                                    <tr key={index}>
                                                       
                                                        <td>
                                                            {lot.id}
                                                        </td>
                                                        <td>
                                                            {lot.reference}
                                                        </td>
                                                        <td>
                                                            {lot.createdDate}
                                                        </td>
                                                        <td>
                                                            {lot.requestedBy}
                                                        </td>
                                                        <td>
                                                            {getStoreNameById(lot.fromStoreId)}
                                                        </td>
                                                        <td>
                                                        {getStoreNameById(lot.toStoreId)}
                                                        </td>
                                                        <td>
                                                        <CButton color="btn btn-info form-control" title='Load Request' type="button" onClick={() => loadRequestNumber(lot.id,lot.requestedBy,lot.toStoreId,lot.fromStoreId)} >
                                                            <CIcon icon={cilCloudDownload} />
                                                        </CButton>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                            
                                        </tbody>
                                    </table>

                                    
                                </CModalBody>

                            </CModal>
                        </CRow >


                        
                    </CCardBody>

                </CCard>
            </CCol>
        </CRow >

    )
}

export default StockTransfer
