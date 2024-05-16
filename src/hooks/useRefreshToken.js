import swal from 'sweetalert';
import axios from '../config/axios'

const useRefreshToken = () => {
    const refresh = async () => {
        try{
        const token = localStorage.getItem("refreshToken")
        const response = await axios.post('/auth/refresh', JSON.parse(token));
        
        if (response.data === "Invalid refresh token") {
        } else {
            localStorage.setItem('accessToken', response.data.refreshToken)
            // console.log('refreshed token', response.data.refreshToken)
        }
    
        return response.data.refreshToken
    } catch (error) {
            console.log('error',error)
            localStorage.clear()
            swal('Session Expired', 'Please login again', 'error')
            window.location.href = '/#login'
    }
    }
    return refresh
};

export default useRefreshToken
