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
    CSpinner,
    CInputGroup,
    CInputGroupText

} from '@coreui/react';
import Select from 'react-select';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import swal from 'sweetalert';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilSearch, cilTrash } from '@coreui/icons';
import SearcInline from '../common/SearchComponentInline';

const contextUrl = '/store';
const storeTypeUrl = '/store-type'; // Assuming this is your endpoint for store types

function StoreForm() {
    const axiosPrivate = useAxiosPrivate();
    const [loading, setLoading] = useState(false);
    const [storeTypes, setStoreTypes] = useState([]);
    const [data, setData] = useState([]);
    const [validated, setValidated] = React.useState(false)
    const [searchText, setSearch] = React.useState('')
    const [editMode, setEditMode] = React.useState(false)
    const [submitLabel, setSubmitLabel] = React.useState('Save Store')

    const initialData = {
        id: '',
        name: '',
        type: '',
    };


    const [formData, setFormData] = useState(initialData);

    useEffect(() => {
        const fetchStoreTypes = async () => {
            setLoading(true);
            try {
                const response = await axiosPrivate.get(storeTypeUrl);
                const types = response.data.map(type => ({
                    value: type.id,
                    label: type.name,
                }));
                setStoreTypes(types);
            } catch (error) {
                console.error('Failed to fetch store types:', error);
                swal("Error", "Failed to load store types", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchStoreTypes();
        fetchStores()
    }, [axiosPrivate]);



    const fetchStores = async () => {
        setLoading(true);
        let dataset = [];
        try {
            const headers = {
                'name': searchText
            };
            const response = await axiosPrivate.get(contextUrl, { headers });
            dataset = response.data
        } catch (error) {
            dataset = [];
        }
        setData(dataset);
        setLoading(false);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSelectStoreType = (selectedOption) => {
        setFormData(prevState => ({
            ...prevState,
            storeType: selectedOption.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Adjust the endpoint and method (POST/PUT) as necessary
            const response = await axiosPrivate.post(contextUrl, formData, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });
            swal("Success", "Store Saved Successfully!", "success");
            clear()
            await fetchStores()
        } catch (error) {
            swal("Error", error.response ? error.response.data.error : "There was a problem saving the store", "error");
        } finally {
            setLoading(false);
        }
    };

    const filterHandler = async () => {
        await fetchStores()
    }

    const searchTextFunction = (search) => {
        setSearch(search)
    };

    const searchToEnter = (e) => {
        if (e.key === 'Enter') {
            fetchStores()
        }
    }

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
                    const response = await axiosPrivate.get(
                        contextUrl + `/${row.id}`
                    );

                    if (response.data) {
                        setFormValues(response.data)
                        setEditMode(true)
                        setSubmitLabel('Update Store');

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

    const clear = async () => {
        setFormData(initialData);
        setSubmitLabel('Register User')
        setValidated(false)
        setEditMode(false)
    }

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
                            const respo = await axiosPrivate.delete(contextUrl + `/${row.id}`)
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
                name: 'Store Name',
                selector: row => row.name,
                sortable: false,
            },

            {
                name: "Store Type",
                cell: row => (storeTypes.find(a => a.value === row.type) || {}).label,
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
    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Store</strong> <small>Management</small>
                    </CCardHeader>
                    <CCardBody>
                        <CForm onSubmit={handleSubmit}>
                            <CRow className="mb-3">
                                <CCol md={6}>
                                    <CFormLabel htmlFor="name">Store Name</CFormLabel>
                                    <CFormInput type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                                </CCol>
                                <CCol md={6}>
                                    <CFormLabel htmlFor="type">Store Type</CFormLabel>
                                    <Select
                                        name="type"
                                        options={storeTypes}
                                        onChange={handleSelectStoreType}
                                        value={storeTypes.find(type => type.value === formData.type)}
                                        isLoading={loading}
                                        required
                                    />
                                </CCol>
                            </CRow>
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
                                        <CButton color="danger form-control" className='customcolorDanger' type="reset" onClick={clear} style={{ color: 'white' }}  >
                                            Reset
                                        </CButton>
                                    )}
                                </CCol>
                            </CRow>

                        </CForm>

                        <p></p>
                        <CCard className="mb-4">
                            <CCardHeader>
                                <small>Store Details </small>
                            </CCardHeader>
                            <CCardBody>
                                <SearcInline
                                    searchText={searchText}
                                    setSearchText={searchTextFunction}
                                    columns={columns}
                                    data={data}
                                    loading={loading}
                                    searchToEnter={searchToEnter}
                                    filterHandler={filterHandler}
                                />
                            </CCardBody>
                        </CCard>


                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
}

export default StoreForm;
