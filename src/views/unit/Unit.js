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
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import swal from 'sweetalert';
import { cilPencil, cilSearch, cilTrash } from '@coreui/icons';
import SearcInline from '../common/SearchComponentInline';
import CIcon from '@coreui/icons-react';

const unitUrl = '/unit';
function UnitForm() {
    const axiosPrivate = useAxiosPrivate();
    const [loading, setLoading] = useState(false);
    const [submitLabel, setSubmitLabel] = React.useState('Save Unit')
    const [data, setData] = useState([]);
    const [searchText, setSearch] = React.useState('')
    const [editMode, setEditMode] = React.useState(false)
    const [validated, setValidated] = React.useState(false)
    const initialData = {
        unit: '',
        code: '',
    };

    const [formData, setFormData] = useState(initialData);

    useEffect(() => {
        fetchUnits()
    }, [axiosPrivate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {

            if (editMode) {
                const response = await axiosPrivate.put(`${unitUrl}/${formData.id}`, formData, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                });
            } else {
                const response = await axiosPrivate.post(unitUrl, formData, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                });
            }


            swal("Success", editMode ? "Unit updated successfully!" : "Unit saved successfully!", "success");
            setFormData(initialData); // Reset form
            clear()
            await fetchUnits()
        } catch (error) {
            swal("Error", error.response ? error.response.data.error : "There was a problem saving the unit", "error");
        } finally {
            setLoading(false);
        }
    };

    const clearForm = () => {
        setFormData(initialData);
    };


    const filterHandler = async () => {
        await fetchUnits()
    }

    const searchTextFunction = (search) => {
        setSearch(search)
    };

    const searchToEnter = (e) => {
        if (e.key === 'Enter') {
            fetchUnits()
        }
    }


    const fetchUnits = async () => {
        setLoading(true);
        let dataset = [];
        try {
            const headers = {
                'unit': searchText
            };
            const response = await axiosPrivate.get(unitUrl, { headers });
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
                        unitUrl + `/${row.id}`
                    );

                    if (response.data) {
                        setFormValues(response.data)
                        setEditMode(true)
                        setSubmitLabel('Update Unit');

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
        setSubmitLabel('Save Unit')
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
                            const respo = await axiosPrivate.delete(unitUrl + `/${row.id}`)
                            if (respo.data.status === false) {
                                swal("Error", respo.data.message, "error");
                            } else {
                                const newData = data.filter(a => a.id !== row.id)
                                setData(newData)
                                swal("Success", "Unit Removed Successfully !", "success");
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
                name: 'Unit',
                selector: row => row.unit,
                sortable: false,
            },
            {
                name: "Code",
                cell: row => row.code,
                sortable: false,
            },
            {
                name: "Action",
                width: "120px",
                sortable: false,
                cell: row => <div><button title='Update Unit' className='btn btn-warning small' onClick={handleEdit(row)}><CIcon icon={cilPencil} /></button> <button title='Remove Unit' className='btn btn-danger small ' onClick={handleDelete(row)}><CIcon icon={cilTrash} style={{ color: 'white' }} /></button></div>
            },
        ],
        [handleEdit]
    );

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Unit</strong> <small>Management</small>
                    </CCardHeader>
                    <CCardBody>
                        <CForm onSubmit={handleSubmit}>
                            <CRow className="mb-3">
                                <CCol md={6}>
                                    <CFormLabel htmlFor="unit">Unit</CFormLabel>
                                    <CFormInput type="text" id="unit" name="unit" value={formData.unit} onChange={handleChange} required />
                                </CCol>
                                <CCol md={6}>
                                    <CFormLabel htmlFor="code">Code</CFormLabel>
                                    <CFormInput type="text" id="code" name="code" value={formData.code} onChange={handleChange} required />
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol xs={2}>
                                    <CButton color="primary" className='form-control' type="submit" disabled={loading}>
                                        {loading ? <CSpinner size="sm" /> : 'Save Unit'}
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
                                <small>Unit Details </small>
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

export default UnitForm;
