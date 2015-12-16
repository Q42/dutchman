/**
 * Dutchman
 * A Dutch linguistics utility library
 * by Q42
 * -----------------------------------
 * @package   q42:dutchman
 * @author    Jimmy Aupperlee <jimmy@q42.nl>
 * @license   https://github.com/Q42/meteor-dutchman/blob/master/LICENSE  MIT
 * @link      https://atmospherejs.com/q42/dutchman
 */

'use strict';

/**
 * Methods available on the client
 * @class Meteor.DutchmanServer
 * @constructor
 */
Meteor.DutchmanClient = class {

    /**
     * @method removeStopWords
     * @param {String} string The string from which to remove the stopwords
     * @param {String} lang The languageCode for which stopwords array to use in the process.
     *                      At the moment this can either be 'nl' or 'en'
     * @return {Array} returns an array containing all valid stems
     */
    removeStopWords(string, lang) {

        check(string, String);
        return FlyingDutchman.removeStopWords(FlyingDutchman.cleanString(string),
            (lang == 'en') ? stopwordsArray_EN : stopwordsArray_NL);
    }
};