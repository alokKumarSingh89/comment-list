module.exports = {
  GITHUB_PERSONAL_ACCESS_TOKEN: require('./token'),
  RATE: '/rate_limit',
  COMMIT_URL: '/repos/REPOSITORY/comments?page=PAGE',
  PULL_URL:
    '/repos/REPOSITORY/pulls/comments?page=PAGE&sort=created_at&direction=desc',
  ISSUE_URL:
    '/repos/REPOSITORY/issues/comments?page=PAGE&sort=created_at&direction=desc',
}
