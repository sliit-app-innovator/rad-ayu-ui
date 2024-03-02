
import React, { useEffect, useState, useCallback, useMemo } from 'react'
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
    CSpinner,
} from '@coreui/react'
import Select from 'react-select'
import axios from '../../config/axios'
import swal from 'sweetalert';
import CIcon from '@coreui/icons-react'
import SearchModal from './SearchComponent';

import {
    cilTrash,
    cilPencil,
    cilSearch
} from '@coreui/icons'
const contextUrl = '/user'

function UserForm() {

    const [loading, setLoading] = React.useState(false)
    const [validated, setValidated] = React.useState(false)
    const [data, setData] = useState([]);
    const [editMode, setEditMode] = React.useState(false)
    const [submitLabel, setSubmitLabel] = React.useState('Register User')
    const [searchText, setSearch] = React.useState('')
    const [visibleSearch, setvisibleSearch] = React.useState(false)
    const [titleList] = React.useState([
        { value: "1", label: 'Mr.' },
        { value: "2", label: 'Mrs.' },
        { value: "3", label: 'Miss.' },
        { value: "4", label: 'Ms.' },
        { value: "5", label: 'Dr.' },
        { value: "6", label: 'Prof.' },
    ])

    const [userRoleList] = React.useState([
        { value: 'ADMIN', label: 'ADMIN' },
        { value: 'HO_WARD', label: 'HO WARD' },
        { value: 'HO_OPD', label: 'HO OPD' },
        { value: 'PHARMACIST', label: 'PHARMACIST' },
        { value: 'STORE_MANAGER', label: 'STORE MANAGER' },

    ])

    const [departmentList] = React.useState([
        { value: 1, label: 'Administration' },
        { value: 2, label: 'IT' },
        { value: 3, label: 'Helth' },
    ])

    const visibleSearchFunction = (status) => {
        setvisibleSearch(status)
    };

    const searchTextFunction = (search) => {
        setSearch(search)
    };



    const initialUserData = {
        id: '',
        title: '',
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        employeeNumber: '',
        designation: '',
        userRole: '',
        departmentId: '',
    };
    const [formData, setFormData] = useState(initialUserData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const handleSelectTitle = (selectedOption) => {
        setFormData({
            ...formData,
            title: selectedOption.value
        });
    };

    const handleSelectRole = (selectedOption) => {
        setFormData({
            ...formData,
            userRole: selectedOption.value
        });
    };

    const handleSelectDepartment = (selectedOption) => {
        setFormData({
            ...formData,
            departmentId: selectedOption.value
        });
    };

    const clear = async () => {
        setFormData(initialUserData);
        setSubmitLabel('Register User')
        setValidated(false)
        setEditMode(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            if (editMode) {
                const response = await axios.put(contextUrl + `/${formData.id}`, formData, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                })
                swal("Success", "User Updated Successfully !", "success");
            } else {

                const response = await axios.post(contextUrl, formData, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                })
                swal("Success", "User Registered Successfully !", "success");
            }
            clear();

        } catch (error) {
            // console.error('An error occurred:', error.response.data.error);
            swal("Problem", error.response ? error.response.data.error : 'Problem with Data Submission', "error");
        }
        finally {
            setLoading(false);
        }
    };

    const setFormValues = (values) => {
        setFormData({
            ...formData,
            ...values
        });
    };


    const handleEdit = useCallback(
        row => async () => {
            setLoading(true)
            try {
                if (row.id) {
                    const response = await axios.get(
                        contextUrl + `/${row.id}`
                    );

                    if (response.data) {
                        setFormValues(response.data)
                        setEditMode(true)
                        setSubmitLabel('Update User');
                        setvisibleSearch(false)
                    }
                }
            } catch (error) {
                console.log('problem with data loading')
            }
            finally {
                setLoading(false)
            }
        },
    );

    const handleDelete = useCallback(
        row => async () => {
            swal({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then(async (willDelete) => {
                    if (willDelete) {
                        try {
                            const respo = await axios.delete(contextUrl + `/${row.id}`)
                            if (respo.data.status === false) {
                                swal("Error", respo.data.message, "error");
                            } else {
                                const newData = data.filter(a => a.id !== row.id)
                                setData(newData)
                                swal("Success", "User Removed Successfully !", "success");
                                clear()
                            }
                        } catch (error) {
                            swal("Error", error.response.data.message, "error");
                        }
                    }
                });
        },

    );

    const columns = useMemo(
        () => [
            {
                name: 'First Name',
                selector: row => row.firstName,
                sortable: false,
            },
            {
                name: "Last Name",
                selector: row => row.lastName,
                sortable: false,
            },
            {
                name: "Username",
                selector: row => row.username,
                sortable: false,
            },
            {
                name: "Designation",
                selector: row => row.designation,
                sortable: false,
            },
            {
                name: "Action",
                width: "120px",
                sortable: false,
                cell: row => <div><button title='Update User' className='btn btn-warning small' onClick={handleEdit(row)}><CIcon icon={cilPencil} /></button> <button title='Remove User' className='btn btn-danger small ' onClick={handleDelete(row)}><CIcon icon={cilTrash} style={{ color: 'white' }} /></button></div>
            },
        ],
        [handleEdit]
    );

    const filterHandler = async () => {
        await fetcUsers()
    }

    const openSearchModal = async () => {
        setSearch('')
        setvisibleSearch(!visibleSearch)
        fetcUsers()
    }

    const fetcUsers = async () => {
        setLoading(true);
        let dataset = [];
        try {
            const headers = {
                'name': searchText
            };
            const response = await axios.get(contextUrl, { headers });
            dataset = response.data
        } catch (error) {
            dataset = [];
        }
        setData(dataset);
        setLoading(false);
    };



    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader className="r1">
                        <CRow>
                            <CCol md={11}>
                                <strong>User</strong> <small>Management</small>
                            </CCol>
                            <CCol md={1}>
                                <small>
                                    <CButton title='Search User' data-testid="serch-button" className='btn customcolorPrimary' onClick={(e) => openSearchModal()}>
                                        <CIcon style={{ color: 'white' }} icon={cilSearch}></CIcon>
                                    </CButton>
                                </small>
                            </CCol>
                        </CRow>
                    </CCardHeader>
                    <CCardBody>
                        <CForm className="row g-3 needs-validation" validated={validated} onSubmit={handleSubmit}>
                            <p></p>
                            <CRow>
                                <CCol md={12}>
                                    <CRow>
                                        <CCol md={2}>
                                            <CFormLabel htmlFor="title">Title  <span className='required-flag'>*</span> </CFormLabel>
                                            <Select onChange={handleSelectTitle} aria-label="title" name="title" id="title" options={titleList} value={titleList.find(a => a.value === formData.title) ?? ''} required />
                                        </CCol>
                                        <CCol md={4}>
                                            <CFormLabel htmlFor="employeeNumber">Employee No  <span className='required-flag'>*</span>  </CFormLabel>
                                            <CFormInput type='text' data-testid="employeeNumber" id="employeeNumber" required name="employeeNumber" value={formData.employeeNumber} onChange={handleChange}></CFormInput>
                                        </CCol>
                                        <CCol md={6}>
                                            <CFormLabel htmlFor="designation">Designation  <span className='required-flag'>*</span>  </CFormLabel>
                                            <CFormInput type='text' data-testid="designation" id="designation" required name="designation" value={formData.designation} onChange={handleChange}></CFormInput>
                                        </CCol>
                                    </CRow>
                                    <p></p>
                                    <CRow>
                                        <CCol md={6}>
                                            <CFormInput type="hidden" id="id" name='id' value={formData.id} />
                                            <CFormLabel htmlFor="firstName">First Name <span className='required-flag'>*</span> </CFormLabel>
                                            <CFormInput type='text' id="firstName" data-testid="firstName" name="firstName" required value={formData.firstName} onChange={handleChange}></CFormInput>
                                        </CCol>
                                        <CCol md={6}>
                                            <CFormLabel htmlFor="lastName">Last Name <span className='required-flag'>*</span> </CFormLabel>
                                            <CFormInput type="lastName" data-testid="lastName" id="lastName" name="lastName" value={formData.lastName} required onChange={handleChange} />
                                        </CCol>
                                    </CRow>
                                    <p></p>
                                    <CRow>
                                        <CCol md={6}>
                                            <CFormLabel htmlFor="username">Username  <span className='required-flag'>*</span> </CFormLabel>
                                            <CFormInput id="username" data-testid="username" name="username" required value={formData.username} onChange={handleChange}></CFormInput>
                                        </CCol>
                                        <CCol md={6}>
                                            <CFormLabel htmlFor="password">Password  <span className='required-flag'>*</span>  </CFormLabel>
                                            <CFormInput type='password' data-testid="password" id="password" required name="password" value={formData.password} onChange={handleChange}></CFormInput>
                                        </CCol>
                                    </CRow>
                                    <p></p>
                                    <CRow>
                                        <CCol md={6}>
                                            <CFormLabel htmlFor="userRole">Role  <span className='required-flag'>*</span> </CFormLabel>
                                            <Select onChange={handleSelectRole} aria-label="userRole" name="userRole" id="userRole" options={userRoleList} value={userRoleList.find(a => a.value === formData.userRole) ?? ''} required />
                                        </CCol>
                                        <CCol md={6}>
                                            <CFormLabel htmlFor="departmentId">Department  <span className='required-flag'>*</span> </CFormLabel>
                                            <Select onChange={handleSelectDepartment} aria-label="departmentId" name="departmentId" id="departmentId" options={departmentList} value={departmentList.find(a => a.value === formData.departmentId) ?? ''} required />
                                        </CCol>

                                    </CRow>
                                    <p></p>

                                </CCol>
                            </CRow>
                            <p></p>
                            <CRow>
                                <CCol xs={2} >
                                    {loading ? (
                                        <CSpinner variant="grow" />
                                    ) : (
                                        <CButton color="primary form-control" className='customcolorPrimary' type="submit" >
                                            {submitLabel}
                                        </CButton>
                                    )}
                                </CCol>
                                <CCol xs={2}>
                                    {loading ? (
                                        <CSpinner color="primary" variant="grow" />
                                    ) : (
                                        <CButton color="danger form-control" className='customcolorDanger' type="reset" onClick={clear} >
                                            Reset
                                        </CButton>
                                    )}
                                </CCol>
                            </CRow>
                        </CForm>
                        <p></p>

                        <SearchModal
                            visible={visibleSearch}
                            onClose={() => visibleSearchFunction(false)}
                            searchText={searchText}
                            setSearchText={searchTextFunction}
                            columns={columns}
                            data={data}
                            loading={loading}
                            filterHandler={filterHandler}
                        />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow >
    )
}
export default UserForm