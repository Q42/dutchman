'use strict';

const   Hunspell    = Npm.require("nodehun"),
        Dictionary  = Npm.require('dictionary-nl');

this.DutchmanHunspell = class {

    suggestions(word) {
        check(word, String);
        const these = this;
        return new Promise((resolve, reject) => {
            these.fetchDictionary().then(() => {
                if(these.dict == null) {
                    return reject("Dictionary not available");
                }
                these.dict.spellSuggestions(word, (err, correct, suggestions, originalWord) => {
                    if(err) {
                        return reject(err);
                    }
                    resolve({
                        originalWord: originalWord,
                        correct: correct,
                        suggestions: suggestions
                    });
                });
            },reject);
        });

        if(this.dict == null) {
            return this.fetchDictionary(promise)
        }
        return promise;
    }

    stem(word) {
        check(word, String);
        const these = this;
        return new Promise((resolve, reject) => {
            these.fetchDictionary().then(() => {

                if(these.dict == null) {
                    return reject("Dictionary not available");
                }
                these.dict.stem(word, (err, stems) => {
                    if(err) {
                        return reject(err);
                    }
                    resolve(stems);
                });

            }, reject);
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