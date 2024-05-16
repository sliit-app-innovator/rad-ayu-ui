import swal from 'sweetalert';
import axios from '../config/axios'

const useRefreshToken = () => {
    const refresh = async () => {
        const token = localStorage.getItem("refreshToken")
        const response = await axios.post('/auth/refresh', JSON.parse(token));
        
        if (response.data === "Invalid refresh token") {
            swal('Session Expired', 'Please login again', 'error')
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            //refresh page
            window.location.reload()

            // console.log('refresh token expired')
        } else {
            localStorage.setItem('accessToken', response.data.refreshToken)
            // console.log('refreshed token', response.data.refreshToken)
        }
        return response.data.refreshToken
    }
    return refresh
};

export default useRefreshToken
