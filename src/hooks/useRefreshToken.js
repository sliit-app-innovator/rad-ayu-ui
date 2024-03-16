import axios from '../config/axios'

const useRefreshToken = () => {
    const refresh = async () => {
        const token = localStorage.getItem("refreshToken")
        const response = await axios.post('/auth/refresh', JSON.parse(token));
        console.log('$#$#$#$#$#$#$#%$')
        console.log(response)
        if (response.data === "Invalid refresh token") {
        } else {
            localStorage.setItem('accessToken', response.data.accessToken)
        }
        return response.data.accessToken
    }
    return refresh
};

export default useRefreshToken
