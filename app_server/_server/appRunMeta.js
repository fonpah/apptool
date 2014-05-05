/**
 * User: DISI
 * Date: 12.08.13
 * Time: 21:26
 */

var fs = require('fs-extra');
var time = require('./../modules/graphic_authoring/util/time.js');
var logger = require('log4js').getLogger(null);

var serverStartTime = exports.serverStartTime = time.currentSStamp();

var packageFile = fs.readJsonSync('./package.json');
var appConfigFile = fs.readJsonSync('./app_config.json');
var devInfoFilePath = './app_dev_info.json';
var appDevInfo = exports.appDevInfo = fs.readJsonSync(devInfoFilePath);

var appName = exports.appName = appConfigFile.appName;
var runMode = exports.runMode = appConfigFile.runMode; // dev|demo|alpha
var plateSdf = exports.plateSdf = appConfigFile.plateSdf;
var database = exports.database = appConfigFile.database;
var versionNum = exports.versionNum = packageFile.version;
var emailConfig = exports.emailConfig = appConfigFile.emailConfig;




logger.setLevel('debug');

var buildNum = '';
var devInfoStr = '';



exports.readDevInfo = function () {

    console.log('versionNum: ' + versionNum);
    if (appDevInfo === null) {
        return;
    }
    /** @namespace appDevInfo.clientSideTestNum */
    var clientSideTestNum = appDevInfo.clientSideTestNum;
    /** @namespace appDevInfo.serverSideTestNum */
    var serverSideTestNum = appDevInfo.serverSideTestNum;
    console.log('clientSideTestNum: ' + clientSideTestNum);
    console.log('serverSideTestNum: ' + serverSideTestNum);


    exports.updateDevInfo('s_startUp');
};
exports.updateDevInfo = function (from) {

    //noinspection JSValidateTypes
    if (runMode === 'dev') {
//        devInfoStr = generateDevInfoStr();
//        writeDevInfo();
        if (from === 's_startUp') {
            appDevInfo.serverSideTestNum++;
            writeDevInfo();
        } else if (from === 'c_page_authoring') {
            appDevInfo.clientSideTestNum++;
            writeDevInfo();
        }

    }
    buildNum = appDevInfo.serverSideTestNum + '.' + appDevInfo.clientSideTestNum;
    devInfoStr = generateDevInfoStr();


};
exports.getDevInfoStr = function () {
    return devInfoStr;
};

exports.getVersionNum = function () {
    return versionNum;
};
exports.getBuildNum = function () {
    return buildNum;
};

exports.logger = logger;

writeDevInfo = function () {

    fs.outputJson(devInfoFilePath, exports.appDevInfo, function (err) {
        if (err) throw err;

    });
};
generateDevInfoStr = function () {

    return 'ver=' + versionNum
        + ' [#'
        + exports.appDevInfo.serverSideTestNum + '.' +exports.appDevInfo.clientSideTestNum
        + ']'
        + ', run=' + runMode
        + ', update=' + serverStartTime;
};
