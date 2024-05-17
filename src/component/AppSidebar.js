import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler, CSpinner } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { AppSidebarNav } from './AppSidebarNav'
import _nav from '../data/_nav';
import './app.css'



import SimpleBar from 'simplebar-react'
import { cib500px, cil4k } from '@coreui/icons'
import logoIcon from '../assets/logo.png'

const AppSidebar = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const from = location.state?.from?.pathname || '/'
    const dispatch = useDispatch()
    const unfoldable = useSelector((state) => state.sidebarUnfoldable)
    const sidebarShow = useSelector((state) => state.sidebarShow)
    const [menues, setMenues] = React.useState(_nav)

    const [loading, setLoading] = React.useState(false)


    const gotoHome = () => {
        navigate(from, { replace: true })
    }

    return (
        <CSidebar
            position="fixed"
            unfoldable={unfoldable}
            visible={sidebarShow}
            onVisibleChange={(visible) => {
                dispatch({ type: 'set', sidebarShow: visible })
            }}
        >
            <CSidebarBrand className="cd" style={{cursor:'pointer'}} onClick={gotoHome}  >
                <img src={logoIcon} alt="Icon Description" height="75" />
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