# AppSec Community Academy

The path-selection portal for the SAINTCON AppSec Community Academy. It presents four active academy qualifications and routes each learner to the experience for their path.

## Academy routes

| Route | Audience | State |
| --- | --- | --- |
| `/cadets/` | Beginners | Active; proxies `appsec-cadet-academy` |
| `/navigators/` | Programmers | Active; proxies `SaintCon-AppSec-Dev-2026` |
| `/communication-officers/` | AppSec professionals | Active; proxies `appsec-officer-academy` |
| `/commanders/` | IT and security leadership | Active; proxies `appsec-commander-academy` |

## Run the complete local academy

The five repositories must be siblings:

```text
parent/
├── appsec-community-academy/
├── appsec-cadet-academy/
├── SaintCon-AppSec-Dev-2026/
├── appsec-officer-academy/
└── appsec-commander-academy/
```

Then run:

```sh
docker compose up --build
```

Open <http://localhost:8085>. The gateway serves every path through the same local origin.

For portal-only development, start the four academies on ports 8086, 8089, 8087, and 8088, then run `npm start`. No portal npm installation is required. Override `CADET_ORIGIN`, `NAVIGATOR_ORIGIN`, `OFFICER_ORIGIN`, or `COMMANDER_ORIGIN` if those services use different addresses.

## Test

```sh
npm test
```

## Production deployment

Deploy the portal at `https://appsec.community/` and route the four active prefixes to their independently deployed academy services:

- `/cadets/` → Cadet Academy
- `/navigators/` → Navigator Academy
- `/communication-officers/` → Communication Officer Academy
- `/commanders/` → Commander Academy

`nginx.conf` is the complete local gateway configuration. If production ingress owns the active route proxies, build the standalone portal image with:

```sh
docker build --build-arg NGINX_CONFIG=nginx.standalone.conf -t appsec-community-academy .
```

Otherwise, adapt the gateway upstream names for the production network while preserving the public paths.

All assets are local, and the portal has no runtime dependencies, accounts, APIs, or build step.
