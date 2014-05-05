/**
 * Created by DISI on 19.04.2014.
 */
var enUS = require('./lang-en-US').uiTexts;
var zhCN = require('./lang-zh-CN').uiTexts;



exports.getUiText = function (key, lang) {

    if (lang === 'zh-cn') {
        return zhCN[key];
    } else {
        return enUS[key];
    }


}
exports.getUiTexts = function (locale) {
    if (locale === 'zh-cn') {
        return zhCN;
    } else {
        return enUS;
    }
}