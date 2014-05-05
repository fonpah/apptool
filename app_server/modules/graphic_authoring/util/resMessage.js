/**
 * User: Disi
 * Date: 30.06.13
 * Time: 16:57
 * Description:
 */
var common = require('../util/common.js');
var langController = require('../../../../app_locale/langController.js');
var message = {
    success: null,
    type: null,
    body: null
};
exports.setTrueTextRes = function (text) {
    message.success = true;
    message.type = 'message';
    message.body = text;
    return message;
}
exports.setFalseTextRes = function (text) {
    message.success = false;
    message.type = 'message';
    message.body = text;
    return message;
}
exports.setFalseRefLockRes = function (req, domain) {
    var target;
    if (domain.type === 'metaModel') {
        target = 'model';
    } else if (domain.type === 'metaPhase') {
        target = 'phase';
    } else if(domain.type === 'metaEnvironment'){
        target = 'environment';
    } else if(domain.type === 'courseActorOrg'){
        target = 'organization';
    }

    message.success = false;
    message.type = 'message';
    message.body = langController.getUiText("key183", req.session.user.lang);
    return message;
}
exports.setNeedAuthorityRes = function () {
    message.success = false;
    message.type = 'needAuthority';
    message.body = null;
    return message;
}
exports.setNeedAuthorityByCmdRes = function () {
    message.success = false;
    message.type = 'command';
    message.body = 'window.location = "/"';
    return message;
}