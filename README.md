# flp-njs
Docker-contained nginx-based ([njs](http://nginx.org/en/docs/njs/index.html)) backend for [event-transmitter](https://github.com/qiwi/event-transmitter).
Prints all logged events to stdout.  

## Usage
```bash
docker pull docker.pkg.github.com/qiwi/flp-njs/flp-njs:latest
docker run -p 8080:8080 -p 8081:8081 flp-njs
```

## REST API
### POST /event
Log event to stdout. Be careful with personal data!
```shell
curl -X POST \
  http://localhost:8080/event \
  -H 'Content-Type: application/json' \
  -d '{ \
  "message": "test-string", \
  "tags": [ \
    "test-string" \
  ], \
  "code": "test-string", \
  "level": "error", \
  "meta": { \
    "appName": "test-string", \
    "appHost": "test-string", \
    "appVersion": "test-string", \
    "appNamespace": "test-string", \
    "appConfig": {}, \
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36", \
    "envProfile": "ci" \
  }, \
  "timestamp": "2020-09-12T13:28:37.157Z", \
  "details": {} \
}'
```
Returns plain text `roger that`.
### POST /event-batch
Log batch of events to stdout. Be careful with personal data!
```shell
curl -X POST \
  http://localhost:8080/event-batch \
  -H 'Content-Type: application/json' \
  -H 'cache-control: no-cache' \
  -d '{ \
  "events": [ \
    {
      "message": "test-string", \
      "tags": [ \
        "test-string" \
      ], \
      "code": "test-string", \
      "level": "error", \
      "meta": { \
        "appName": "test-string", \
        "appHost": "test-string", \
        "appVersion": "test-string", \
        "appNamespace": "test-string", \
        "appConfig": {}, \
        "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36", \
        "envProfile": "ci" \
      }, \
      "timestamp": "2020-09-12T13:28:37.157Z", \
      "details": {} \
    } \
  ] \
}'
```
Returns plain text `roger that`.
### GET /health, /healthcheck
Check application status
```shell
curl http://localhost:8080/healthcheck
```
Returns json:
```json
{
    "result": {
        "status": "UP"
    }
}
```
### GET :8081/buildstamp
Get application build info
```shell
curl http://localhost:8081/buildstamp
```
Returns json:
```json
{
    "git": {
        "commitId": "6d39d85a344501acba2b428e1441f277c87637f8",
        "repoUrl": "https://github.com/qiwi/flp-njs.git",
        "repoName": "qiwi/flp-njs"
    },
    "date": "2021-04-30T11:32:04.437Z"
}
```
## Development & local usage
| Cmd | Description |
|---|---|
| `yarn` | Fetch deps |
| `yarn build` | Build njs, nginx *.conf and dcr container
| `yarn build:local` | As prev, but adds `local/flp-njs` image tag
| `yarn test` | Run linter & unit tests
| `yarn test:integration` | Test `local/flp-njs` image
| `yarn start:b` | Build and run app container |
| `yarn start` | Run container |
| `yarn stop` | Shut down container |

## License
[MIT](./LICENSE)
