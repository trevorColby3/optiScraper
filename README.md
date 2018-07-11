# optiScraper
### IMPORTANT: 
- This repository is deprecated. The production version was moved to a private repository. To protect user sensitive information.
- This repository is also out of date and the screencapture functionality lacks: 
 - Extensive error checking
 - Progress Logging
 - Network error handling
 - Auto relaunch
- Missing aspects were added and code format was improved upon in version 2.0 housed in private repo
            

A puppeteer driver scraper that accesses Opti Dashboards and saves snapshots as PDFs

 Build tool depends on on v10.4.0 version of node. It is helpful to use `nvm` if you requrie multiple versions of node for different projects. See `.nvmrc` file. 

 We are usingn `npm` version 6.x. This is required for the `npm-shrinkwrap.json` in this particular repo.

 Verify node and npm versions installed with:

``` 
node --version
npm --version 
```

If an older version of npm is installed, it is important to install the suggested one.

``` 
npm install -g npm@(specified version here) 
```
Once correct node and npm versions are installed, install the needed dependencies with:
`npm install`
# Tests

- To Setup: `npm run testSetup` or `node test-setup.js`
- To Run: `npm test` or `node test`
> Important: 
> - `grunt test` is not sufficient.
> - `npm test` also runs `test-setup.js`

