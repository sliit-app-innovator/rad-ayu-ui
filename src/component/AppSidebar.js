import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler, CSpinner } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { AppSidebarNav } from './AppSidebarNav'
import _nav from '../data/_nav';
import './app.css'



import SimpleBar from 'simplebar-react'


const AppSidebar = () => {

    const dispatch = useDispatch()
    const unfoldable = useSelector((state) => state.sidebarUnfoldable)
    const sidebarShow = useSelector((state) => state.sidebarShow)
    const [menues, setMenues] = React.useState(_nav)

    const [loading, setLoading] = React.useState(false)

    return (
        <CSidebar
            position="fixed"
            unfoldable={unfoldable}
            visible={sidebarShow}
            onVisibleChange={(visible) => {
                dispatch({ type: 'set', sidebarShow: visible })
            }}
        >
            <CSidebarBrand className="cd" to="/">
                {/* <CIcon className="md" icon={logoNegative} height={75} width={250} /> */}
                {/* <CIcon className="sidebar-brand-narrow" icon={sygnet} height={35} /> */}
            </CSidebarBrand>
            <CSidebarNav>
                <SimpleBar>
                    {loading ? (<CSpinner style={{ marginLeft: '45%', marginTop: '50%' }} color="black" variant="grow" />) : (<AppSidebarNav items={menues} />)}
                </SimpleBar>
            </CSidebarNav>
            <CSidebarToggler
                className="d-none d-lg-flex"
                onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
            />
        </CSidebar>
    )
}

export default React.memo(AppSidebar)