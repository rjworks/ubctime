const axios = require('axios');

const axiosInstance = axios.create({
    baseURL: 'https://ubctime.herokuapp.com/api',
    /* other custom settings */
});

export default axiosInstance;