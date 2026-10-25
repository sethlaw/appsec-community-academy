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

The six repositories must be siblings:

```text
parent/
├── appsec-community-academy/
├── appsec-cadet-academy/
├── SaintCon-AppSec-Dev-2026/
├── appsec-officer-academy/
├── appsec-commander-academy/
└── appsec-community-tracker/
```

Then run:

```sh
docker compose up --build
```

Open <http://localhost:8085>. The gateway serves every path through the same local origin, including the activity dashboard at <http://localhost:8085/tracker/>. Tracker data persists in the `tracker-data` Docker volume.

For portal-only development, start the four academies on ports 8086, 8089, 8087, and 8088 and the tracker on 8090, then run `npm start`. No portal npm installation is required. Override `CADET_ORIGIN`, `NAVIGATOR_ORIGIN`, `OFFICER_ORIGIN`, `COMMANDER_ORIGIN`, or `TRACKER_ORIGIN` if those services use different addresses.

Compose builds the current local checkout of each sibling repository; it does not run `git pull`. Pull each repository explicitly before rebuilding so deployment changes remain deliberate and reviewable.

## Test

```sh
npm test
```

## Production deployment

Deploy the portal at `https://appsec.community/` and route the academy and tracker prefixes to their services:

- `/cadets/` → Cadet Academy
- `/navigators/` → Navigator Academy
- `/communication-officers/` → Communication Officer Academy
- `/commanders/` → Commander Academy
- `/tracker/` → Community Tracker dashboard
- `/api/` → Community Tracker API

### DigitalOcean layout

The production host keeps all six working trees under `/opt/appsec-community/` with the same sibling layout shown above. Docker Compose publishes the gateway only on `127.0.0.1:8085`; the host-installed Caddy service uses the repository `Caddyfile` to terminate TLS and proxy `appsec.community` to that loopback address. DNS needs an `A` record for `appsec.community` pointing to the droplet before Caddy can obtain its certificate.

The deployed directories intentionally contain working-tree files rather than Git metadata. Updates are initiated from a development checkout:

1. Pull or otherwise update each of the six local repositories explicitly.
2. Sync each working tree to its matching directory below `/opt/appsec-community/`, excluding `.git`, `node_modules`, build output, and local tracker database files.
3. Rebuild and restart the stack on the host:

   ```sh
   cd /opt/appsec-community/appsec-community-academy
   docker compose up -d --build
   docker compose ps
   curl --fail http://127.0.0.1:8085/api/health
   ```

This deployment model never runs an implicit `git pull` during a container build. The currently reviewed local trees are therefore exactly what gets deployed. Caddy, Docker, the firewall, and the Compose services are all enabled to recover automatically after a host reboot.

`nginx.conf` is the complete local gateway configuration. If production ingress owns the active route proxies, build the standalone portal image with:

```sh
docker build --build-arg NGINX_CONFIG=nginx.standalone.conf -t appsec-community-academy .
```

Otherwise, adapt the gateway upstream names for the production network while preserving the public paths.

All portal assets are local, and the portal has no build step. The tracker is the only stateful service; back up its Docker volume before replacing the host.
