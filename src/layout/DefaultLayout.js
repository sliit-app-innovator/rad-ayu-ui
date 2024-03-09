import React, { useEffect } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../component/index'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCookies } from 'react-cookie'


const DefaultLayout = () => {


    const [cookies] = useCookies(['loggedInUser'])
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || '/login'

    const checkLoggedUserStatus = async () => {
        if (cookies.loggedInUser === undefined || cookies.loggedInUser == null || cookies.loggedInUser === "") {
            navigate(from, { replace: true })
        }
    }

    useEffect(() => {
        checkLoggedUserStatus()
    }, []);


    return (
        <div>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100 bg-light">
                <AppHeader />
                <div className="body flex-grow-1">
                    <AppContent />
                </div>
                <AppFooter />
            </div>
        </div>
    )
}

export default DefaultLayout
