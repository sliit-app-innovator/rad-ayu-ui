// SearchModal.js

import React from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CRow, CCol, CInputGroup, CFormInput, CInputGroupText } from '@coreui/react';
import DataTable from "react-data-table-component";
import { cilSearch } from '@coreui/icons';
import CIcon from '@coreui/icons-react'

function SearchModal({ visible, onClose, searchText, setSearchText, columns, data, loading, filterHandler }) {
    return (
        <CModal size="xl" visible={visible} onClose={onClose} aria-labelledby="userSearch">
            <CModalHeader>
                <CModalTitle id="userSearch">Search User</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CRow>
                    <CCol xs={6}></CCol>
                    <CCol xs={6}>
                        <CInputGroup className="mb-3">
                            <CFormInput
                                placeholder=" Search "
                                id="search"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                            <CInputGroupText className='search-btn' onClick={filterHandler}>
                                <CIcon icon={cilSearch} />
                            </CInputGroupText>
                        </CInputGroup>
                    </CCol>
                </CRow>
                <CRow>
                    <DataTable columns={columns} data={data} progressPending={loading} pagination />
                </CRow>
            </CModalBody>
        </CModal>
    );
}

export default SearchModal;
