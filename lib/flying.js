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

this.FlyingDutchman = class {

    static getHunspell() {
        if (this.dutchmanHunspell == null) {
            this.dutchmanHunspell = new DutchmanHunspell();
        }
        return this.dutchmanHunspell;
    }

    static getTranslate(googleApiKey) {
        check(googleApiKey, String);
        if (this.dutchmanTranslate == null) {
            this.dutchmanTranslate = new DutchmanTranslate(googleApiKey);
        }
        return this.dutchmanTranslate;
    }

    static removeStopWords(string, stopwords) {
        check(string, String);
        check(stopwords, Array);
        const expression = new RegExp(stopwords.join("\\b|\\b"), "gi");
        return string.replace(expression, "").trim();
    }

    static getCleanArray(string) {
        check(string, String);
        return string.split(" ")
            .filter(function(n) {
                return n != undefined && n != ""
            });
    }

    static cleanString(string) {
        check(string, String);
        return FlyingDutchman.getCleanArray(string).join(" ").toLowerCase();
    }
};