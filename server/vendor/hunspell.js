'use strict';

const   Hunspell    = Npm.require("nodehun"),
        Dictionary  = Npm.require('dictionary-nl');

this.DutchmanHunspell = class {

    suggestions(string) {
        check(string, String);
        const these = this;
        return new Promise((resolve, reject) => {
            these.fetchDictionary().then(() => {
                if(these.dict == null) {
                    return reject("Dictionary not available");
                }
                these.dict.spellSuggestions(string, (err, correct, suggestions, originalWords) => {
                    if(err) {
                        return reject(err);
                    }
                    resolve(correct, suggestions, originalWords);
                });
            },reject).catch(reject);
        });

        if(this.dict == null) {
            return this.fetchDictionary(promise)
        }
        return promise;
    }

    stem(string) {
        check(string, String);
        const these = this;
        return new Promise((resolve, reject) => {
            these.fetchDictionary().then(() => {

                if(these.dict == null) {
                    return reject("Dictionary not available");
                }
                these.dict.stem(string, (err, stems) => {
                    if(err) {
                        return reject(err);
                    }
                    resolve(stems);
                });

            }, reject).catch(reject);
        });
    }

    fetchDictionary() {
        const these = this;
        return new Promise((resolve, reject) => {
            Dictionary((err, result) => {
                if(err) {
                    reject();
                }
                these.dict = new Hunspell(result.aff, result.dic);
                resolve();
            });
        });
    }

};