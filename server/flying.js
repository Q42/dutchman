'use strict';

class flying {

    static getHunspell() {

        if (this.dutchmanHunspell == null) {
            this.dutchmanHunspell = new DutchmanHunspell();
        }
        return this.dutchmanHunspell;
    }

    static getTranslate(googleApiKey) {

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
        return string.split(" ")
            .filter(function(n) {
                return n != undefined && n != ""
            });
    }

    static cleanString(string) {
        return string.toLowerCase();
    }
}

Meteor.methods({

    generalize(googleApiKey, text) {
        return new Promise((resolve, reject) => {
            const string = flying.removeStopWords(
                flying.cleanString(text), stopwordsArray_NL);

            try {
                check(googleApiKey, String);
                check(string, String);
            } catch (err) {
                reject(err);
            }

            flying.getTranslate(googleApiKey)
                .translate(string)
                .then(translated => {
                    resolve(flying.getCleanArray(
                        DutchmanSnowball.stem(
                            flying.removeStopWords(
                                translated,
                                stopwordsArray_EN))));
            },reject);

        });
    },

    checkSpelling(text) {
        return new Promise((resolve, reject) => {
            const words = flying.getCleanArray(
                flying.cleanString(text)
            );
            let wordIteration = [];
            words.forEach(word => {
                wordIteration.push(flying.getHunspell().suggestions(word))
            });
            Promise.all(wordIteration).then((result) => {
                resolve(result);
            },(err) => {
                reject(err);
            });
        });
    }
});