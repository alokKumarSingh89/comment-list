const leftPad = require('left-pad')
let count = 0
function log(message, increment) {
  process.stdout.write(message)
  if (increment) {
    count += 1
  }
}
function getCount() {
  return count
}
function sortBasedonCommnetAndReturnArray(data) {
  const arr = []
  for (let key in data) {
    arr.push({
      name: key,
      commit: data[key].commit,
      comment: data[key].comment,
    })
  }
  arr.sort((b, a) =>
    a.comment > b.comment ? 1 : b.comment > a.comment ? -1 : 0,
  )

  return arr
}
function print(data) {
  if (Object.keys(data).length <= 0) {
    console.log('\n')
    console.log('    No Comments')
  }
  let sortedData = sortBasedonCommnetAndReturnArray(data)
  console.log('\n')
  sortedData.forEach((obj) => {
    console.log(
      `${leftPad(obj.comment, 4)} comments, ${obj.name} (${
        obj.commit
      } commits)`,
    )
  })
}

module.exports = {
  print,
  log,
  getCount,
}
