## Deployment

S3 deployment is handled by GitHub Actions using OIDC for AWS authentication. See [deploy-setup.md in starter-projects](https://github.com/concord-consortium/starter-projects/blob/main/doc/deploy-setup.md) for how the AWS side is set up, and [docs/deploy.md](docs/deploy.md) for how deploys work in this repo.

### Initial steps

1. Clone this repo and `cd` into it
2. Run `npm install` to pull dependencies
3. Copy the `env.sample` file, rename the copy `.env`, and set the value for `REACT_APP_NASS_PROXY_URL`.
4. Run `npm start` to run `webpack-dev-server` in development mode with hot module replacement

#### Run using HTTPS

Additional steps are required to run using HTTPS.

1. Install [mkcert](https://github.com/FiloSottile/mkcert) : `brew install mkcert` (install using Scoop or Chocolatey on Windows)
2. Create and install the trusted CA in keychain if it doesn't already exist:   `mkcert -install`
3. Ensure you have a `.localhost-ssl` certificate directory in your home directory (create if needed, typically `C:\Users\UserName` on Windows) and cd into that directory
4. Make the cert files: `mkcert -cert-file localhost.pem -key-file localhost.key localhost 127.0.0.1 ::1`
5. Run `npm run start:secure` to run `webpack-dev-server` in development mode with hot module replacement

Alternately, you can run secure without certificates in Chrome:
1. Enter `chrome://flags/#allow-insecure-localhost` in Chrome URL bar
2. Change flag from disabled to enabled
3. Run `npm run start:secure:no-certs` to run `webpack-dev-server` in development mode with hot module replacement

### Building

If you want to build a local version run `npm build`, it will create the files in the `dist` folder.
You *do not* need to build to deploy the code, that is automatic.  See more info in the Deployment section below.

### Notes

1. Make sure if you are using Visual Studio Code that you use the workspace version of TypeScript.
   To ensure that you are open a TypeScript file in VSC and then click on the version number next to
   `TypeScript React` in the status bar and select 'Use Workspace Version' in the popup menu.

## Proxy

This application requires a proxy server to access the NASS QuickStats API. The proxy URL is configured via the `REACT_APP_NASS_PROXY_URL` environment variable. For development, you can use a locally-running instance of [nass-proxy](https://github.com/concord-consortium/nass-proxy).

See the [Deployment](#deployment) section above and [docs/deploy.md](docs/deploy.md) for how releases are built, deployed, and promoted.

### Testing

Run `npm test` to run jest tests. Run `npm run test:full` to run jest and Cypress tests.

##### Cypress Run Options

Inside of your `package.json` file:
1. `--browser browser-name`: define browser for running tests
2. `--group group-name`: assign a group name for tests running
3. `--spec`: define the spec files to run
4. `--headed`: show cypress test runner GUI while running test (will exit by default when done)
5. `--no-exit`: keep cypress test runner GUI open when done running
6. `--record`: decide whether or not tests will have video recordings
7. `--key`: specify your secret record key
8. `--reporter`: specify a mocha reporter

##### Cypress Run Examples

1. `cypress run --browser chrome` will run cypress in a chrome browser
2. `cypress run --headed --no-exit` will open cypress test runner when tests begin to run, and it will remain open when tests are finished running.
3. `cypress run --spec 'cypress/integration/examples/smoke-test.js'` will point to a smoke-test file rather than running all of the test files for a project.

## License

Starter Projects are Copyright 2018 (c) by the Concord Consortium and is distributed under the [MIT license](http://www.opensource.org/licenses/MIT).

See license.md for the complete license text.
