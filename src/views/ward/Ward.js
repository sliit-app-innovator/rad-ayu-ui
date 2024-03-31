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
    CSpinner
} from '@coreui/react';
import Select from 'react-select';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import swal from 'sweetalert';
import { cilPencil, cilSearch, cilTrash } from '@coreui/icons';
import SearcInline from '../common/SearchComponentInline';
import CIcon from '@coreui/icons-react';

const wardTypeUrl = '/ward-type'; // Endpoint for ward types
const wardUrl = '/ward';
function WardForm() {
    const axiosPrivate = useAxiosPrivate();
    const [loading, setLoading] = useState(false);
    const [submitLabel, setSubmitLabel] = React.useState('Save Ward')
    const [data, setData] = useState([]);
    const [searchText, setSearch] = React.useState('')
    const [editMode, setEditMode] = React.useState(false)
    const [validated, setValidated] = React.useState(false)
    const initialData = {
        wardNumber: '',
        description: '',
        typeId: '',
        capacity: 0,
    };

    const [wardTypes] = React.useState([
        { value: 1, label: 'General' },
        { value: 2, label: 'Paediatric' },
        { value: 3, label: 'Maternity' },
        { value: 3, label: 'Surgical' },
    ])

    const [formData, setFormData] = useState(initialData);

    useEffect(() => {
        // const fetchWardTypes = async () => {
        //     setLoading(true);
        //     try {
        //         const response = await axiosPrivate.get(wardTypeUrl);
        //         const types = response.data.map(type => ({
        //             value: type.id,
        //             label: type.name,
        //         }));
        //         setWardTypes(types);
        //     } catch (error) {
        //         console.error('Failed to fetch ward types:', error);
        //         swal("Error", "Failed to load ward types", "error");
        //     } finally {
        //         setLoading(false);
        //     }
        // };
        // fetchWardTypes();
        fetchWards()
    }, [axiosPrivate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSelectWardType = (selectedOption) => {
        setFormData(prevState => ({
            ...prevState,
            typeId: selectedOption.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {

            if (editMode) {
                const response = await axiosPrivate.put(`${wardUrl}/${formData.id}`, formData, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                });
            } else {
                const response = await axiosPrivate.post(wardUrl, formData, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                });
            }


            swal("Success", editMode ? "Ward updated successfully!" : "Ward saved successfully!", "success");
            setFormData(initialData); // Reset form
            clear()
            await fetchWards()
        } catch (error) {
            swal("Error", error.response ? error.response.data.error : "There was a problem saving the ward", "error");
        } finally {
            setLoading(false);
        }
    };

    const clearForm = () => {
        setFormData(initialData);
    };


    const filterHandler = async () => {
        await fetchWards()
    }

    const searchTextFunction = (search) => {
        setSearch(search)
    };

    const searchToEnter = (e) => {
        if (e.key === 'Enter') {
            fetchWards()
        }
    }


    const fetchWards = async () => {
        setLoading(true);
        let dataset = [];
        try {
            const headers = {
                'description': searchText
            };
            const response = await axiosPrivate.get(wardUrl, { headers });
            dataset = response.data
        } catch (error) {
            dataset = [];
        }
        setData(dataset);
        setLoading(false);
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
                        wardUrl + `/${row.id}`
                    );

                    if (response.data) {
                        setFormValues(response.data)
                        setEditMode(true)
                        setSubmitLabel('Update Ward');

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
        setSubmitLabel('Save Ward')
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
                            const respo = await axiosPrivate.delete(wardUrl + `/${row.id}`)
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
                name: 'Ward Number',
                selector: row => row.wardNumber,
                sortable: false,
            },
            {
                name: "Description Type",
                cell: row => row.description,
                sortable: false,
            },
            {
                name: "Capacity",
                cell: row => row.capacity,
                sortable: false,
            },
            {
                name: "Ward Type",
                cell: row => (wardTypes.find(a => a.value === row.typeId) || {}).label,
                sortable: false,
            },

            {
                name: "Action",
                width: "120px",
                sortable: false,
                cell: row => <div><button title='Update Ward' className='btn btn-warning small' onClick={handleEdit(row)}><CIcon icon={cilPencil} /></button> <button title='Remove User' className='btn btn-danger small ' onClick={handleDelete(row)}><CIcon icon={cilTrash} style={{ color: 'white' }} /></button></div>
            },
        ],
        [handleEdit]
    );

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Ward</strong> <small>Management</small>
                    </CCardHeader>
                    <CCardBody>
                        <CForm onSubmit={handleSubmit}>
                            <CRow className="mb-3">
                                <CCol md={6}>
                                    <CFormLabel htmlFor="wardNumber">Ward Number</CFormLabel>
                                    <CFormInput type="number" id="wardNumber" name="wardNumber" value={formData.wardNumber} onChange={handleChange} required />
                                </CCol>
                                <CCol md={6}>
                                    <CFormLabel htmlFor="typeId">Ward Type</CFormLabel>
                                    <Select
                                        name="typeId"
                                        options={wardTypes}
                                        onChange={handleSelectWardType}
                                        value={wardTypes.find(type => type.value === formData.typeId)}
                                        isLoading={loading}
                                        required
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CCol md={6}>
                                    <CFormLabel htmlFor="description">Description</CFormLabel>
                                    <CFormInput type="text" id="description" name="description" value={formData.description} onChange={handleChange} required />
                                </CCol>
                                <CCol md={6}>
                                    <CFormLabel htmlFor="capacity">Capacity</CFormLabel>
                                    <CFormInput type="number" id="capacity" name="capacity" value={formData.capacity} onChange={handleChange} required />
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol xs={2}>
                                    <CButton color="primary" className='form-control' type="submit" disabled={loading}>
                                        {loading ? <CSpinner size="sm" /> : 'Save Ward'}
                                    </CButton>
                                </CCol>
                                <CCol xs={2}>
                                    <CButton color="danger" className='form-control' type="button" onClick={clearForm} disabled={loading}>
                                        Reset
                                    </CButton>
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

export default WardForm;
