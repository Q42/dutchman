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