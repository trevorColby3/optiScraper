"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
//Engineer: Trevor Colby
//Last Modified on 6/14/2018
//
//optiScraper:  A program designed to leverage puppeteer to autonamously
//              log into Opti Portals and take a screenshot of
//              dashboards. The user must supply the script with a
//              credentials file name "creds.json". The json should
//              contain three string entries i.e "username", "password"request//              "dashboard".
const puppeteer = require("puppeteer");
// import puppeteer = require('puppeteer'); //headless browser automation
const creds_1 = require("./creds");
const delay = require('delay');
const chalk = require('chalk'); //Colored console output
const cli = require('clui');
const log = console.log; //Console Logging Abbreviation
// const size = require('window-size');
var Progress = cli.Progress;
var CredLength = creds_1.CREDS.dashboard.length + 2; //length of Dashboard number + spaces
//function to console log promise rejection or failed promise return
//Arguments: error message from try catch block and string name of action
function failure(err, attemptedAction) {
    process.stdout.write(chalk.red(' ☒ '));
    process.stdout.write(chalk.white(" Failed: "));
    process.stdout.write(chalk.white(attemptedAction));
    log("");
    console.error(err);
    log("");
    log(chalk.red("If needed: <CTR> + 'C' To Exit"));
}
//function to console log action success
////Arguments: string name of action
function success(attemptedAction) {
    process.stdout.write(chalk.green(' ☑ '));
    process.stdout.write(chalk.white(attemptedAction));
    process.stdout.write(chalk.white(' Successful  '));
}
//loop to set progress bar spacing
function addSpaces(num, color) {
    var i;
    if (color == "blue") {
        for (i = 0; i < num; i++) {
            process.stdout.write(chalk.bgBlue("-"));
        }
    }
    else {
        for (i = 0; i < num; i++) {
            process.stdout.write(" ");
        }
    }
}
//async function to drive puppeteer
(() => __awaiter(this, void 0, void 0, function* () {
    addSpaces(CredLength + 5, "blue");
    process.stdout.write(chalk.bgBlue('------------ Dashboard Capture ------------'));
    addSpaces(CredLength + 5, "blue");
    log("");
    addSpaces(CredLength + 5, "none");
    log(chalk.blue('        - Begining Launch Process -\n'));
    var scrapperProgressBar = new Progress(10); //progress bar out of 10
    //**************************** Preparation phase ****************************
    //DOM element selectors used for mouse clicks and navigation
    //Format: CSS selectors
    const UsernameSelector = '#i0116';
    const NextSelector = '#idSIButton9';
    const PasswordSelector = '#i0118';
    const SignInSelector = '#idSIButton9';
    const dashboardSelector = "/dashboard/" + creds_1.CREDS.dashboard;
    //array of  actions that need to be completed
    var actions = [
        "Puppeteer Launch",
        "Browser Launch",
        "Opti Portal Launch",
        "Credential Entry: Username",
        "Credential Entry: Password",
        "Start Navigation to Dashboard " + creds_1.CREDS.dashboard,
        "Initial Resource Load",
        "Dashboard Screenshot",
        "Browser Shutdown",
        "Dashboard Data Load"
    ];
    //construct set of XHR requests to look for
    const endpointsOfInterest = ["datastreambrowserview", "taskboard", "usersettings", "usergroup"];
    const longestActionLength = actions[5].length;
    //**************************** ACTION PHASE ****************************
    //First Action: Launch puppeteer
    try {
        var browser = yield puppeteer.launch();
        success(actions[0]);
        addSpaces(longestActionLength - actions[0].length, "none");
        log(scrapperProgressBar.update(0.1));
    }
    catch (puppetError) {
        failure(puppetError, actions[0]);
        process.exit(1);
    }
    //Second Action: Launch Headless Chromium browser
    try {
        var page = yield browser.newPage();
        yield page.setViewport({
            width: 1920,
            height: 0
        });
        success(actions[1]);
        addSpaces(longestActionLength - actions[1].length, "none");
        log(scrapperProgressBar.update(0.2));
    }
    catch (browserError) {
        failure(browserError, actions[1]);
        process.exit(1);
    }
    //Third Action: Nav to Opti login page
    try {
        yield page.goto('https://portal.onopti.com', { waitUntil: 'networkidle2' });
        success(actions[2]);
        addSpaces(longestActionLength - actions[2].length, "none");
        log(scrapperProgressBar.update(0.3));
    }
    catch (portalError) {
        failure(portalError, actions[2]);
        process.exit(1);
    }
    //Fourth Action: Username Credential Entry
    //               enter username and click next
    //               confirm next page load
    try {
        yield page.click(UsernameSelector);
        yield page.keyboard.type(creds_1.CREDS.username);
        yield page.click(NextSelector);
        yield page.waitForNavigation({ waitUntil: 'networkidle2' });
        success(actions[3]);
        addSpaces(longestActionLength - actions[3].length, "none");
        log(scrapperProgressBar.update(0.4));
    }
    catch (usernameError) {
        failure(usernameError, actions[3]);
        process.exit(1);
    }
    //Fifth Action: Password Credential Entry
    //              enter password and click next
    //              confirm next page load
    try {
        yield page.click(PasswordSelector);
        yield page.keyboard.type(creds_1.CREDS.password);
        yield page.click(SignInSelector);
        yield page.waitForNavigation({ waitUntil: 'networkidle2' });
        success(actions[4]);
        addSpaces(longestActionLength - actions[4].length, "none");
        log(scrapperProgressBar.update(0.5));
    }
    catch (passwordError) {
        failure(passwordError, actions[4]);
        process.exit(1);
    }
    //Sixth Action: Start nav to correct dashboard
    try {
        yield page.goto("https://portal.onopti.com" + dashboardSelector + "/");
        success(actions[5]);
        log(scrapperProgressBar.update(0.6));
    }
    catch (dashShotError) {
        failure(dashShotError, actions[5]);
        process.exit(1);
    }
    //Seventh Action: Wait for the page to fully load.
    //                Watches for taskboard-view cllass to fully render
    //                and then waits 500 ms for insurance. Maximum wait time
    //                is 60 seconds, if not promise is rejected.
    var contentLoadPromise = page.waitForSelector(".taskboard-view", { timeout: 60000 })
        .catch((contentLoadError) => { failure(contentLoadError, actions[6]); });
    //if the contentLoadPromise is return succesfully, print out success
    contentLoadPromise.then(function (value) {
        success(actions[6]);
        addSpaces(longestActionLength - actions[6].length, "none");
        log(scrapperProgressBar.update(0.7));
    });
    //time delay acts as insurance in seventh action: page load
    try {
        //insure that we have waited enough time through event loop to get
        //everything loaded enough to work
        yield delay(10000);
        success(actions[9]);
        addSpaces(longestActionLength - actions[9].length, "none");
        log(scrapperProgressBar.update(0.8));
    }
    catch (delayError) {
        failure(delayError, actions[9]);
        process.exit(1);
    }
    //Eighth Action: Take a screenshot of the specified dashboard.
    //               Full page Selection is currently on; however,
    //               Adjustment of this is possible by adding properties
    //               to the screenshot options object. See the puppeteer
    //               API documentation for details.
    //               https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagescreenshotoptions
    try {
        const body = yield page.waitForSelector('body', { timeout: 60000 });
        const mainView = yield page.waitForSelector('#mainArea', { timeout: 60000 });
        yield mainView.$$('.podContainer'); //wait for some pods
        const box = mainView ? yield mainView.boundingBox() : undefined;
        const height = Math.ceil(box.height); //Must be an integer
        // log(`height: ${height} ${typeof height}`);
        yield page.setViewport({
            width: 1920,
            height
        });
        yield page.screenshot({ path: 'screenShots/dashboard.png', fullPage: true });
        success(actions[7]);
        addSpaces(longestActionLength - actions[7].length, "none");
        log(scrapperProgressBar.update(0.9));
    }
    catch (dashShotError) {
        failure(dashShotError, actions[7]);
        process.exit(1);
    }
    //Eighth Action: Close Headless Browser
    //close browser
    try {
        yield browser.close();
        success(actions[8]);
        addSpaces(longestActionLength - actions[8].length, "none");
        log(scrapperProgressBar.update(1.0));
        addSpaces(CredLength + 5, "none");
        process.stdout.write(chalk.blue("\n------- Dashboard Capture Complete --------\n"));
    }
    catch (closeError) {
        failure(closeError, actions[8]);
        process.exit(1);
    }
}))();
//# sourceMappingURL=optiScraper.js.map