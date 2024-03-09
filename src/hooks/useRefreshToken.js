import axios from '../config/axios'

const useRefreshToken = () => {
    const refresh = async () => {
        const token = localStorage.getItem("refreshToken")
        const response = await axios.post('/auth/refresh', JSON.stringify(token));
        localStorage.setItem('accessToken', response.data.accessToken)
        return response.data.accessToken
    }
    return refresh
};

export default useRefreshToken
