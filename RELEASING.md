# Releasing

Image publishing runs in [`.github/workflows/docker.yml`](.github/workflows/docker.yml) when a git tag matching `v*.*.*` is pushed. The workflow does not create the GitHub Release. Create that with `gh` after the tag exists.

Pushes to `main` do not publish images. An existing version tag is never overwritten. The moving tag `:beta` may point at a newer prerelease.

Do not push any tag whose name contains `-` until this beta-channel workflow is on `main`. A `-beta` tag pushed before that would still move `:latest`.

## Stable release

A tag `vX.Y.Z` (no `-` in the name), for example `v0.5.12`, builds the app and the Home Assistant add-on for amd64 and arm64/aarch64.

The app image receives:

- `:X.Y.Z` (for example `:0.5.12`)
- `:X.Y` (for example `:0.5`)
- `:latest`

The add-on images receive the version tag and `:latest` on each architecture. Create the GitHub Release for that tag in the usual way, without `--prerelease`.

## Beta release

Beta is Docker and Unraid only. There is no beta add-on. On a prerelease tag the add-on jobs do not run, so they push nothing: no add-on version tag and no add-on `:latest`. Home Assistant keeps serving the stable add-on.

A prerelease tag is any `v*` tag whose name contains `-`, for example `v0.5.12-beta.1`.

That tag publishes only these app tags:

- `:X.Y.Z-beta.N` (for example `:0.5.12-beta.1`)
- `:beta`

`:latest` does not move. The rolling minor tag `:X.Y` (for example `:0.5`) does not move. Pushing another prerelease moves `:beta` to that build. The version tag itself is still refused if it already exists, so `v0.5.12-beta.1` cannot be published twice. Use the next prerelease number.

Create the GitHub Release as a prerelease and do not mark it as the latest release:

```bash
gh release create vX.Y.Z-beta.N --prerelease --latest=false
```

Example:

```bash
gh release create v0.5.12-beta.1 --prerelease --latest=false
```

`--latest=false` keeps the stable release as GitHub's latest release. `--prerelease` marks the release as a prerelease.

### Check that stable tags did not move

Before you push the beta tag, record the digests of the stable app tags:

```bash
docker buildx imagetools inspect ghcr.io/hiddevanbrussel/dashboard-home-assistant:latest
docker buildx imagetools inspect ghcr.io/hiddevanbrussel/dashboard-home-assistant:0.5
```

After the workflow finishes, run the same two commands again. The digests must be unchanged. Then confirm the new tags exist:

```bash
docker buildx imagetools inspect ghcr.io/hiddevanbrussel/dashboard-home-assistant:0.5.12-beta.1
docker buildx imagetools inspect ghcr.io/hiddevanbrussel/dashboard-home-assistant:beta
```

`:beta` and `:0.5.12-beta.1` should share a digest. `:latest` and `:0.5` should still show the digests you recorded before the beta tag. The add-on repositories are not part of a beta publish.

Pull requests and manual runs of [`.github/workflows/docker-beta-dry-run.yml`](.github/workflows/docker-beta-dry-run.yml) check this tag math for `refs/tags/v0.0.0-beta.1` and `refs/tags/v0.0.0`. That job pushes nothing.
