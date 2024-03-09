import React from 'react'
import { NavLink } from 'react-router-dom'

import {
    CContainer,
    CHeader,
    CHeaderBrand,
    CHeaderNav,
    CHeaderToggler,
    CNavLink
} from '@coreui/react'

import CIcon from '@coreui/icons-react';
import { cilHome } from '@coreui/icons';

import './header.css'

const AppHeader = () => {





    return (
        <CHeader position="sticky" className="mb-4 mb-4-new" >
            <CContainer fluid className="r2">
                <CHeaderToggler className="ps-1">
                    <CNavLink to="/dashboard" component={NavLink}>
                        <strong>  <CIcon icon={cilHome} size='xl'></CIcon>  AYU </strong>
                    </CNavLink>
                </CHeaderToggler>
                <CHeaderBrand className="mx-auto d-md-none" to="/">
                </CHeaderBrand>
                <CHeaderNav className="ms-3">

                </CHeaderNav>
            </CContainer>
        </CHeader>
    )
}

export default AppHeader