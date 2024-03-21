import React from 'react'
import CIcon from '@coreui/icons-react'
import {
    cilAddressBook,
    cilPeople, cilStorage,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
    {
        component: CNavTitle,
        name: 'AYU - Inventory',
    },
    {
        component: CNavItem,
        name: 'Store Management',
        to: '/store',
        icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Medicine Management',
        to: '/medicine',
        icon: <CIcon icon={cilAddressBook} customClassName="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'User Register',
        to: '/user',
        icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    },


]

export default _nav
