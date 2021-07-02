const axios = require('axios');

const axiosInstance = axios.create({
    baseURL: 'http://ubctime.herokuapp.com/api',
    /* other custom settings */
});

export default axiosInstance;