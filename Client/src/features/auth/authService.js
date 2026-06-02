import axios from 'axios'

const API_URL = "/api/auth"

// register user
const register = async(formData) => {
    const response = await axios.post(API_URL + "/register" , formData)
    localStorage.setItem('user',JSON.stringify(response.data))
    return response.data
}

// login user
const login = async(formData) => {
    const response = await axios.post(API_URL + "/login" , formData)
    localStorage.setItem('user',JSON.stringify(response.data))
    return response.data
}

const fetchProfile = async(name) => {
    const response = await axios.get('/api/profile/' + name)
    return response.data
}

const authService = { register, login, fetchProfile }

export default authService