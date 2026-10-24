module.exports = {
  "requireConfig": "ignored",
  "onboarding": false,
  "dryRun": "full",
  "extends": [
    "github>reddoorla/.github:renovate-config",
    "github>reddoorla/reddoor-starter//.github/renovate-probe-1688/test-rules#claude/renovate-1688-probe"
  ],
  "force": {
    "schedule": [
      "at any time"
    ]
  }
};
