module.exports = {
  "requireConfig": "ignored",
  "onboarding": false,
  "extends": [
    "github>reddoorla/.github:renovate-config",
    "github>reddoorla/reddoor-starter//.github/renovate-probe-1688/slots-rules#claude/renovate-1688-probe"
  ],
  "prHeader": "**Renovate #1688 proof, never merge.** A probe for reddoorla/reddoor-maintenance#1688 (reddoor-workspace `briefs/2026-10-24-renovate-follow-up-1688.md`). Draft, automerge off, outside the `renovate/` prefix.",
  "force": {
    "schedule": [
      "at any time"
    ],
    "branchPrefix": "probe/1688-r2-slots-control/",
    "branchPrefixOld": "probe/1688-r2-slots-control/",
    "dependencyDashboard": false,
    "dependencyDashboardTitle": "1688 probe dashboard (never created)",
    "draftPR": true,
    "prHourlyLimit": 2,
    "prConcurrentLimit": 0,
    "branchConcurrentLimit": 0,
    "vulnerabilityAlerts": {
      "enabled": false
    },
    "osvVulnerabilityAlerts": false
  }
};
