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
} from '@coreui/react';
import Select from 'react-select';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import swal from 'sweetalert';
import SearchModal from '../common/SearchComponent';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilSearch, cilTrash } from '@coreui/icons';

const contextUrl = '/medicine';
const unitUrl = '/unit';
const medicineCategoryUrl = '/medicine-category';

function MedicineForm() {
    const axiosPrivate = useAxiosPrivate();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [submitLabel, setSubmitLabel] = React.useState('Save Medicine')
    const [selectedUnit, setSelectedUnit] = useState({});
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        code: '',
        type: '1', // 'Raw Material' or 'Product'
        medicineType: '',
        unit: ''
    });
    const [categoryOptions, setCategoryOptions] = useState([]);

    const [unitOPtions, setUnitOPtions] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [visibleSearch, setVisibleSearch] = useState(false);
    const [searchText, setSearch] = React.useState('')

    useEffect(() => {
        fetcInitialData()
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (selectedOption) => {
        setFormData(prev => ({ ...prev, medicineType: selectedOption.value }));
    };
    const handleUnitChange = (selectedOption) => {
        setFormData(prev => ({ ...prev, unit: selectedOption.value }));
    };

    const handleSearchModal = (status) => {
        setVisibleSearch(status);
        if (status) {
            fetcMedicines()
        }
    };
    const searchTextFunction = (search) => {
        setSearch(search)
    };

    const filterHandler = async () => {
        await fetcMedicines()
    }

    const searchToEnter = (e) => {
        if (e.key === 'Enter') {
            fetcMedicines()
        }
    }

    const fetcMedicines = async () => {
        setLoading(true);
        let dataset = [];
        try {
            const headers = {
                'name': searchText
            };
            const response = await axiosPrivate.get(contextUrl, { headers });

            dataset = response.data
            dataset.forEach(element => {
                if (element.unit) {
                    element.unitName = (unitOPtions.find(a => a.value == element.unit) || {}).label
                }
                if (element.medicineType) {
                    element.medicineTypeName = (categoryOptions.find(a => a.value == element.medicineType) || {}).label
                }

            });

        } catch (error) {
            dataset = [];
        }
        setData(dataset);
        setLoading(false);
    };

    const handleEdit = useCallback(
        row => async () => {
            setLoading(true);
            try {
                const response = await axiosPrivate.get(`${contextUrl}/${row.id}`);
                if (response.data) {
                    setFormData(response.data);

                    setEditMode(true);
                    setVisibleSearch(false);
                }
            } catch (error) {
                swal("Error", "Problem fetching medicine details.", "error");
            } finally {
                setLoading(false);
            }
        },
        [axiosPrivate, formData],
    );

    const columns = useMemo(
        () => [
            {
                name: 'Name',
                selector: row => row.name,
                sortable: false,
            },
            {
                name: "Code",
                selector: row => row.code,
                sortable: false,
            },
            {
                name: "Medicint Type",
                selector: row => row.medicineTypeName,
                sortable: false,
            },
            {
                name: "Item Type",
                selector: row => row.type === 1 ? 'Product' : 'Raw Material',
                sortable: false,
            },
            {
                name: "Unit",
                selector: row => row.unitName,
                sortable: false,
            },
            {
                name: "Action",
                width: "120px",
                sortable: false,
                cell: row => <div><button title='Update Medicine' className='btn btn-warning small' onClick={handleEdit(row)}><CIcon icon={cilPencil} /></button> <button title='Remove Medicine' className='btn btn-danger small ' onClick={handleDelete(row)}><CIcon icon={cilTrash} style={{ color: 'white' }} /></button></div>
            },
        ],
        [handleEdit]
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
                            const respo = await axiosPrivate.delete(contextUrl + `/${row.id}`)
                            if (respo.data.status === false) {
                                swal("Error", respo.data.message, "error");
                            } else {
                                const newData = data.filter(a => a.id !== row.id)
                                setData(newData)
                                swal("Success", "Medicine Removed Successfully !", "success");
                                clear()
                            }
                        } catch (error) {
                            swal("Error", error.response.data.message, "error");
                        }
                    }
                });
        },

    );


    const clear = () => {
        setFormData({
            id: '',
            name: '',
            code: '',
            type: '1', // 'Raw Material' or 'Product'
            medicineType: '',
            unit: ''
        });
        handleUnitChange({ value: '' })
        setEditMode(false);
    };


    const fetcInitialData = async () => {
        setLoading(true);
        let categories = [];
        let units = [];
        try {
            const respMedicinecategory = await axiosPrivate.get(medicineCategoryUrl);
            respMedicinecategory.data.map((type) => {
                return categories.push({ value: type.id, label: type.name })
            })
            setCategoryOptions(categories)

            const respUnit = await axiosPrivate.get(unitUrl);

            respUnit.data.map((type) => {
                return units.push({ value: type.id, label: type.unit })
            })
            setUnitOPtions(units)


        } catch (error) {
            units = [];
            units = []
        }
        setLoading(false);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editMode) {
                await axiosPrivate.put(`${contextUrl}/${formData.id}`, formData);
                swal("Success", "Medicine updated successfully!", "success");
            } else {
                await axiosPrivate.post(contextUrl, formData);
                swal("Success", "Medicine added successfully!", "success");
            }
            clear();
        } catch (error) {
            swal("Error", "An error occurred during the operation.", "error");
        } finally {
            setLoading(false);
        }
    };



    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <CRow>
                            <CCol md={11}>
                                <strong>Medicine</strong> <small>Management</small>
                            </CCol>

                            <CCol md={1}>
                                <small>

                                    <CButton title='Search User' data-testid="serch-button" className='btn customcolorPrimary' onClick={(e) => handleSearchModal(true)}>
                                        <CIcon style={{ color: 'white' }} icon={cilSearch}></CIcon>
                                    </CButton>
                                </small>
                            </CCol>
                        </CRow>
                    </CCardHeader>
                    <CCardBody>
                        {/* <pre> {JSON.stringify(formData, null, 2)}</pre> */}

                        <CForm onSubmit={handleSubmit}>
                            <CRow className="mb-3">
                                <CCol md={6}>
                                    <CFormLabel htmlFor="name">Medicine Name</CFormLabel>
                                    <CFormInput type="text" id="name" name="name" required value={formData.name} onChange={handleChange} />
                                </CCol>
                                <CCol md={6}>
                                    <CFormLabel htmlFor="code">Code</CFormLabel>
                                    <CFormInput type="text" id="code" name="code" required value={formData.code} onChange={handleChange} />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CCol md={6}>
                                    <CFormLabel htmlFor="unit">Mesuring Unit</CFormLabel>
                                    <Select id="unit" name="unit" options={unitOPtions} value={unitOPtions.find(a => a.value === formData.unit) ?? ''} onChange={handleUnitChange} required />
                                </CCol>
                                <CCol md={6}>
                                    <CFormLabel htmlFor="category">Medicine Type</CFormLabel>
                                    <Select id="category" options={categoryOptions} value={categoryOptions.find(a => a.value === formData.medicineType) ?? ''} onChange={handleCategoryChange} required />
                                </CCol>

                            </CRow>
                            <p></p>
                            <CRow className="mb-3">
                                <CCol md={2}>
                                    <CFormLabel>Item Type</CFormLabel>
                                </CCol>
                                <CCol md={2}>
                                    <CFormCheck type="radio" name="type" id="product" label="Product" value="1" onChange={handleChange} checked={formData.type == '1'} />
                                </CCol>
                                <CCol md={2}>
                                    <CFormCheck type="radio" name="type" id="rawMaterial" label="Raw Material" value="0" onChange={handleChange} checked={formData.type == '0'} />
                                </CCol>


                            </CRow>
                            <p></p>
                            <br></br>
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
                                        <CButton color="danger form-control" className='customcolorDanger' style={{ color: 'white' }} type="reset" onClick={clear} >
                                            Reset
                                        </CButton>
                                    )}
                                </CCol>
                            </CRow>
                        </CForm>


                    </CCardBody>
                </CCard>
                {visibleSearch && (
                    <SearchModal
                        visible={visibleSearch}
                        onClose={() => handleSearchModal(false)}
                        searchText={searchText}
                        setSearchText={searchTextFunction}
                        columns={columns}
                        data={data}
                        loading={loading}
                        heading={'Search Medicine'}
                        filterHandler={filterHandler}
                        searchToEnter={searchToEnter}
                    />
                )}
            </CCol>
        </CRow>
    );
}

export default MedicineForm;
