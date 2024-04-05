import React from 'react'
import CIcon from '@coreui/icons-react'
import {
    cilAddressBook,
    cilApplications,
    cilBuilding,
    cilPeople, cilSettings, cilShare, cilStorage, cilUser,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
    {
        component: CNavTitle,
        name: 'AYU - Inventory',
    },
    {
        component: CNavGroup,
        name: 'Administration ',
        to: '/administration',
        icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
        items: [
            {
                component: CNavItem,
                name: 'Store Management',
                to: '/store',
                icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
            },
            {
                component: CNavItem,
                name: 'Ward Management',
                to: '/ward',
                icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
            },
            {
                component: CNavItem,
                name: 'Medicine Management',
                to: '/medicine',
                icon: <CIcon icon={cilAddressBook} customClassName="nav-icon" />,
            },
        ],
    },
    {
        component: CNavGroup,
        name: 'Transactions ',
        to: '/transactions',
        icon: <CIcon icon={cilApplications} customClassName="nav-icon" />,
        items: [
            {
                component: CNavItem,
                name: 'Stock Retrieval',
                to: '/stock-retrieval',
                icon: <CIcon icon={cilShare} customClassName="nav-icon" />,
            },

            {
                component: CNavItem,
                name: 'Medicine Issuing',
                to: '/medicine-Issuing',
                icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
            },
        ],
    },
    {
        component: CNavGroup,
        name: 'Utilities',
        to: '/utilities',
        icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
        items: [
            {
                component: CNavItem,
                name: 'User Register',
                to: '/user',
                icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
            },
        ],
    },






]

export default _nav
