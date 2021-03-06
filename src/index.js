const chalk = require('chalk')
const minimist = require('minimist')

const config = require('./config')
const { pullComment, merge } = require('./comments')
const { log, print } = require('./utils')
const { fetchRate } = require('./rate')

async function start() {
  const args = minimist(process.argv.slice(2))
  let messages = '\n    Fetching comments'
  const repo = args._[0] || args['repo']
  if (!repo) {
    throw new Error('Repo is required')
  }

  let period = parseInt(args._[1] || args['period'] || '-1', 10)
  if (period >= 1) {
    messages += ` ${chalk.blue('for')} past ${period} days`
  }
  messages += ` ${chalk.blue('for')} ${chalk.yellowBright(`"${repo}"`)}...\n\n`
  log(messages)
  log('    ')
  let COMMIT_URL = config.COMMIT_URL.replace(/REPOSITORY/, repo)
  let PULL_URL = config.PULL_URL.replace(/REPOSITORY/, repo)
  let ISSUE_URL = config.ISSUE_URL.replace(/REPOSITORY/, repo)
  const rateLimit = await fetchRate(config.RATE)
  Promise.all([
    pullComment(COMMIT_URL, period, rateLimit.remaining, 'commit'),
    pullComment(PULL_URL, period, rateLimit.remaining),
    pullComment(ISSUE_URL, period, rateLimit.remaining),
  ])
    .then((res) => {
      let data = {}
      data = merge(res[0], data)
      if (res[1]) {
        data = merge(res[1], data)
      }
      if (res[2]) {
        data = merge(res[2], data)
      }
      print(data)
    })
    .catch((err) => {
      console.log('Found error while pulling the comment', err)
    })
}

start()
