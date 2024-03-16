// SearchModal.js

import React from 'react';
import { CRow, CCol, CInputGroup, CFormInput, CInputGroupText } from '@coreui/react';
import DataTable from "react-data-table-component";
import { cilSearch } from '@coreui/icons';
import CIcon from '@coreui/icons-react'

function SearcInline({ searchText, setSearchText, columns, data, loading, filterHandler, searchToEnter }) {
    return (
        <>
            <CRow>
                <CCol xs={6}></CCol>
                <CCol xs={6}>
                    <CInputGroup className="mb-3">
                        <CFormInput
                            placeholder=" Search "
                            id="search"
                            value={searchText}
                            onKeyUp={(e) => searchToEnter(e)}
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
        </>

    );
}

export default SearcInline;
