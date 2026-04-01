import axios from 'axios'

const API_URL = "/api/auth"

const register = async(formData) => {
    // console.log(formData)
    const response = await axios.post(API_URL + "/register" , formData)
    localStorage.setItem('user',JSON.stringify(response.data))
    return response.data
}


const authService = {register}

export default authService