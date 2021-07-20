const axios = require('axios')
const baseURL = 'http://social-api:3008/api/v1/'
const timeout = 1000

const userRequest = ({ userId }) =>
  axios.create({
    baseURL,
    timeout,
    headers: {
      'Authorization': `Basic ${userId}`
    }
  })

module.exports = { userRequest }
