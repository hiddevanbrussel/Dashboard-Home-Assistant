# Security Policy

## Supported versions

Security fixes are published in the latest release only. Older releases are unsupported.

## Reporting a vulnerability

Report vulnerabilities privately through GitHub private vulnerability reporting for this repository: [open a security advisory](https://github.com/hiddevanbrussel/Dashboard-Home-Assistant/security/advisories/new).

Please include:

- What is wrong, and what someone could do with it
- Steps to reproduce, or a proof of concept
- The version or commit you tested (in-app **Settings → System**, or the image tag)
- Whether you run the Home Assistant add-on, Docker, or Unraid, when that changes the impact

You will get a reply on the advisory after the report has been read. If the issue is confirmed, a fix is prepared for the latest release and disclosure stays on that advisory.

## Hardening

- Keep the dashboard on your LAN, or publish it only through a reverse proxy you control.
- Set `APP_SECRET` to a long random value of at least 32 characters. It encrypts stored secrets, including the Home Assistant token.
- Leave port 3000 off the public internet.
