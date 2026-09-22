# Deployment

S3 deployment is handled by GitHub Actions. Pushes are deployed to `models-resources/nass-plugin/` by the `s3-deploy` job in [`ci.yml`](../.github/workflows/ci.yml).

Branches are deployed to http://nass-plugin.concord.org/branch/<name>.
If the branch name starts or ends with a number this number is stripped off.

Tags are deployed to http://nass-plugin.concord.org/version/<name>.

A released version is promoted to the top-level `index.html` by [`release.yml`](../.github/workflows/release.yml) via `workflow_dispatch`.

## Production release steps

1. Increment version number in package.json
2. Create new entry in CHANGELOG.md
3. Run `git log --pretty=oneline --reverse <last release tag>...HEAD | grep '#' | grep -v Merge` and add contents (after edits if needed to CHANGELOG.md)
4. Run `npm run build`
5. Copy asset size markdown table from previous release and change sizes to match new sizes in `dist`
6. Create `release-<version>` branch and commit changes, push to GitHub, create PR and merge
7. Checkout main and pull
8. Create an annotated tag for the version, of the form `v[x].[y].[z]`, include at least the version in the tag message. On the command line this can be done with a command like `git tag -a v1.2.3 -m "1.2.3 some info about this version"`
9. Push the tag to github with a command like: `git push origin v1.2.3`.
10. Use https://github.com/concord-consortium/nass-codap-plugin/releases to make this tag into a GitHub release.
11. Run this repo's `Release` workflow to promote the tagged version to the top-level `index.html`.
    1. Navigate to the Actions page in GitHub and click the "Release" workflow.
    2. Click the "Run workflow" menu button.
    3. Type in the tag name you want to release for example `v1.2.3`.
    4. Click the `Run Workflow` button.

## AWS Access

The GitHub actions in this project are allowed to update files in S3 using OIDC. An IAM role has been created in AWS with a trust policy that allows GitHub actions in this specific repository to assume this IAM role. The IAM role has a `RepoName` tag and a managed policy that uses this tag to give the role's users permission to update files in `models-resources/[RepoName]`.

This repo's S3 prefix (`nass-plugin`) does not match its GitHub repository name (`nass-codap-plugin`), so the role also has an inline policy, `NassPluginLegacyPrefix`, granting the same object-level permissions on `models-resources/nass-plugin/*`.

See [deploy-setup.md in starter-projects](https://github.com/concord-consortium/starter-projects/blob/main/doc/deploy-setup.md) for how the AWS side is set up.
