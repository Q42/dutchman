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

this.DutchmanTranslate = class {

    constructor(googleApiKey) {
        this.google = Npm.require('google-translate')(googleApiKey);
    }

    translate(stringOrArray) {
        const these = this;
        return new Promise((resolve, reject) => {
            these.translatePromise.apply(these, [resolve, reject, stringOrArray])
        })
    }

    translatePromise(resolve, reject, stringOrArray) {
        this.google.translate(stringOrArray, 'nl', 'en',
            (err, translation) => {
                if(err) {
                    return reject(err);
                }
                resolve(translation.translatedText);
            });
    }
};