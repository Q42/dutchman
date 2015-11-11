'use strict';

Meteor.Dutchman = class {

    constructor(googleApiKey) {

        check(googleApiKey, String);
        this.googleApiKey = googleApiKey;
    }

    generalize(string) {

        check(string, String);
        const these = this;
        return new Promise((resolve, reject) => {
            these.generalizePromise.apply(
                these, [resolve, reject, string])
        });
    }

    generalizePromise(resolve, reject, string) {

        // Check if the API key was set
        check(this.googleApiKey, String);
        const googleApiKey = this.googleApiKey;
        Meteor.call(
            'generalize',
            googleApiKey,
            string,
            function(err, response){
                if(err) {
                    return reject(err);
                }
                resolve(response);
            });
    }

    checkSpelling(string) {

        check(string, String);
        const these = this;
        return new Promise((resolve, reject) => {
            these.checkSpellingPromise.apply(
                these, [resolve, reject, string])
        });
    }

    checkSpellingPromise(resolve, reject, string) {

        check(string, String);
        Meteor.call(
            'checkSpelling',
            string,
            function(err, response){
                if(err) {
                    return reject(err);
                }
                resolve(response);
            });
    }
};