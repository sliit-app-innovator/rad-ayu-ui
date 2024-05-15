import React from 'react'
import { NavLink } from 'react-router-dom'

import {
    CContainer,
    CHeader,
    CHeaderBrand,
    CHeaderNav,
    CHeaderToggler,
    CNavLink,
    CDropdown,
    CDropdownDivider,
    CDropdownHeader,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CAvatar,
} from '@coreui/react'

import CIcon from '@coreui/icons-react';
import { cilHome, cilLockLocked } from '@coreui/icons';
import avatar from '../assets/avatar.png'
import './header.css'
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCookies } from 'react-cookie';


const AppHeader = () => {
    const [cookies, setCookie, removeCookie] = useCookies();
    const location = useLocation()
    const axiosPrivate = useAxiosPrivate()
    const from = location.state?.from?.pathname || '/'
    const navigate = useNavigate()

    const removeAllCookies = () => {
        Object.keys(cookies).forEach(cookieName => removeCookie(cookieName));
    };
    const logout = async () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('jwt')
        navigate(from, { replace: true })
        window.location.reload(false)
        removeAllCookies()
    }



    return (
        <CHeader position="sticky" className="mb-4 mb-4-new" >
            <CContainer fluid className="r2">
                <CHeaderToggler className="ps-1">
                    <CNavLink to="/" component={NavLink}>
                        <strong>  <CIcon icon={cilHome} size='xl'></CIcon>  AYU </strong>
                    </CNavLink>
                </CHeaderToggler>
                <CHeaderBrand className="mx-auto d-md-none" to="/">
                </CHeaderBrand>
                <CHeaderNav className="ms-3">
                    <CDropdown variant="nav-item">
                        <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
                            <CAvatar src={avatar} size="md" />
                        </CDropdownToggle>
                        <CDropdownMenu className="pt-0" placement="bottom-end">
                            <CDropdownHeader className="bg-light fw-semibold py-2">Settings</CDropdownHeader>
                            <CDropdownDivider />
                            <CDropdownItem onClick={logout}>
                                <CIcon icon={cilLockLocked} className="me-2" />
                                Sign Out
                            </CDropdownItem>
                        </CDropdownMenu>
                    </CDropdown>
                </CHeaderNav>
            </CContainer>
        </CHeader>
    )
}

export default AppHeader