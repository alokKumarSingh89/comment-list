const { http } = require('./axiosHttp')
async function fetchRate(url) {
  const res = await http.get(url)
  return res.data.resources.core
}

module.exports = {
  fetchRate,
}
