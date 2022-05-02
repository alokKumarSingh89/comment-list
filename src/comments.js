const moment = require('moment')
const { http } = require('./axiosHttp')
const { log, getCount } = require('./utils')
async function pullComment(repo, period, remaining, type = '', page = 0) {
  const data = {}
  let flag = false
  try {
    log('*', 1)
    const url = repo.replace('PAGE', page)
    if (getCount() > remaining) {
      return data
    }
    const res = await http.get(url)
    if (res.data.length <= 0) {
      return data
    }
    res.data.forEach((item) => {
      if (
        period > -1 &&
        !moment().subtract(period, 'days').isBefore(moment(item.created_at))
      ) {
        if (type !== 'commit') {
          flag = true
        }
        return
      }
      if (data[item.user.login]) {
        data[item.user.login] = {
          comment: item.body
            ? data[item.user.login].comment + 1
            : data[item.user.login].comment,
          commit: item.commit_id
            ? data[item.user.login].comment + 1
            : data[item.user.login].comment,
        }
      } else {
        data[item.user.login] = {
          comment: item.body ? 1 : 0,
          commit: item.commit_id ? 1 : 0,
        }
      }
    })
    let newData = {}
    if (!flag) {
      newData = await pullComment(repo, period, type, page + 1)
    }
    return merge(newData, data)
  } catch (e) {
    console.log(e.stack)
    return data
  }
}
function merge(from, to) {
  for (let key in from) {
    if (to[key]) {
      to[key] = {
        comment: to[key].comment + from[key].comment,
        commit: to[key].commit + from[key].commit,
      }
    } else {
      to[key] = from[key]
    }
  }
  return to
}
module.exports = {
  pullComment,
  merge,
}
