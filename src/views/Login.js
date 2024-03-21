/* eslint-disable no-undef */
/* eslint-disable import/first */
import React from 'react'
import { useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from '../config/axios'
import config from '../config/config'
import { useCookies } from 'react-cookie'
const LOGIN_URL = '/auth/token'
import {
    CButton,
    CCard,
    CCardBody,
    CCardGroup,
    CCol,
    CContainer,
    CForm,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CRow,
    CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import './login.css'
import { cilLockLocked, cilUser } from '@coreui/icons'

const Login = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || '/'
    const [loading, setLoading] = useState(false)
    const [errMsg, setErrMsg] = useState('')
    const [cookies, setCookie] = useCookies(['loggedInUser', 'jwt'])


    const userLoginData = {
        username: '',
        password: '',
    };
    const [formData, setFormData] = useState(userLoginData);


    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        // debugger
        try {
            const username = formData.username
            const response = await axios.post(LOGIN_URL, formData, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            })

            // Extract relevant data from the response
            const { jwt, refreshToken, tokenType } = response.data;

            localStorage.setItem('jwt', jwt)
            localStorage.setItem('refreshToken', JSON.stringify({ username, refreshToken })) // Store refresh token

            setCookie('loggedInUser', username)
            setCookie('jwt', jwt)

            setErrMsg('')
            // Navigate to the specified route, replacing the current URL
            navigate(from, { replace: true })
            window.location.reload()
        } catch (err) {
            // debugger
            // console.log(err)
            if (!err?.response) {
                setErrMsg('No Server Response')
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password')
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized')
            } else {
                setErrMsg('Login Failed')
            }
            // errRef.current.focus()
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };




    return (
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
            <CContainer className="tr">
                <CRow className="justify-content-center">
                    <CCol md={6}>
                        <CCardGroup className="tr1">
                            <CCard className="p-4">
                                <CCardBody>
                                    <CForm onSubmit={handleSubmit}>
                                        <h1>Login</h1>
                                        <p className="t1">Sign In to AYU</p>
                                        <div>
                                            {errMsg ? (
                                                <CAlert color="danger" data-testid="login-error">
                                                    {errMsg}
                                                </CAlert>
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText>
                                                <CIcon icon={cilUser} />
                                            </CInputGroupText>
                                            <CFormInput
                                                placeholder="Username"
                                                name="username"
                                                autoComplete="off"
                                                value={formData.username} onChange={handleChange}
                                                required={true}
                                            />
                                        </CInputGroup>
                                        <CInputGroup className="mb-4">
                                            <CInputGroupText>
                                                <CIcon icon={cilLockLocked} />
                                            </CInputGroupText>
                                            <CFormInput
                                                type="password"
                                                placeholder="Password"
                                                name="password"
                                                value={formData.password} onChange={handleChange}
                                                required={true}
                                            />
                                        </CInputGroup>
                                        <div>
                                            {loading ? (
                                                ''
                                            ) : (
                                                <CRow>
                                                    <CCol xs={6}>
                                                        <CButton type="submit" data-testid="login-button" className="px-4 customcolorPrimary">
                                                            Log in
                                                        </CButton>
                                                    </CCol>
                                                </CRow>
                                            )}
                                        </div>
                                    </CForm>
                                </CCardBody>
                            </CCard>
                        </CCardGroup>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
        // <div className="bg-white min-vh-100 d-flex flex-row align-items-center">
        //     <div className="container">
        //         <div className="row justify-content-center">
        //             <div className="col-md-6">
        //                 <div className="card-group mb-0">
        //                     <div className="card p-4">
        //                         <div className="card-body">
        //                             <form onSubmit={handleSubmit}>
        //                                 <h1 className="text-center mb-4">Login</h1>
        //                                 <p className="text-muted text-center">Sign in to your account</p>
        //                                 {errMsg && (
        //                                     <div className="alert alert-danger" role="alert">
        //                                         {errMsg}
        //                                     </div>
        //                                 )}
        //                                 <div className="mb-3">
        //                                     <div className="input-group">
        //                                         <span className="input-group-text" id="username-addon">
        //                                             <i className="cil-user"></i>
        //                                         </span>
        //                                         <input
        //                                             type="text"
        //                                             className="form-control"
        //                                             placeholder="Username"
        //                                             name="username"
        //                                             autoComplete="off"
        //                                             value={formData.username}
        //                                             onChange={handleChange}
        //                                             required
        //                                         />
        //                                     </div>
        //                                 </div>
        //                                 <div className="mb-4">
        //                                     <div className="input-group">
        //                                         <span className="input-group-text" id="password-addon">
        //                                             <i className="cil-lock-locked"></i>
        //                                         </span>
        //                                         <input
        //                                             type="password"
        //                                             className="form-control"
        //                                             placeholder="Password"
        //                                             name="password"
        //                                             value={formData.password}
        //                                             onChange={handleChange}
        //                                             required
        //                                         />
        //                                     </div>
        //                                 </div>
        //                                 <div className="d-flex justify-content-between">
        //                                     <button className="btn btn-primary" type="submit">Log in</button>
        //                                 </div>
        //                             </form>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>

    )
}
export default Login