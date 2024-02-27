import React from 'react'
import CIcon from '@coreui/icons-react'
import {
    cilPeople,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
    {
        component: CNavTitle,
        name: 'AYU - Inventory',
    },
    {
        component: CNavItem,
        name: 'User Register',
        to: '/user',
        icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    },


]

export default _nav
