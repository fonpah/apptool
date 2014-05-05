/**
 * User: Disi
 * Date: 30.06.13
 * Time: 16:57
 * Description: TODO
 */
var resMessage = require('./resMessage.js');

exports.isLogon = function (req) {
    if (req.session.user === undefined || req.session.user === null) {
        req.session.user = {
            isLogon: false
        }
    }
    return req.session.user.isLogon;
};
exports.isApiLogon = function (req) {
    if (req.session.user === undefined || req.session.user.isLogon === false) {
        if (req.param('apiPassword')) {
            var apiPassword = req.param('apiPassword');
            if (apiPassword === '123456') {
                req.session.user = {
                    userDomain: 'api',
                    isLogon: true
                };
            }
        }else{
            req.session.user = {
                isLogon: false
            }
        }

    }

    return req.session.user.isLogon;
};
exports.checkAuthResPlain = function (req, res, next) {
    if (exports.isLogon(req)) {
        next();
    } else {
        console.log('checkAuthResPlain');
        res.send(resMessage.setNeedAuthorityRes());

    }
};
exports.checkApiAuth = function (req, res, next) {
    if (exports.isApiLogon(req)) {
        next();
    } else {
        console.log('checkApiAuth');
        res.send(resMessage.setNeedAuthorityRes());

    }
};