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
}

Meteor.methods({

    generalize(googleApiKey, text) {
        return new Promise((resolve, reject) => {
            const string = flying.removeStopWords(text, stopwordsArray_NL);

            try {
                check(googleApiKey, String);
                check(string, String);
            } catch (err) {
                reject(err);
            }

            flying.getHunspell().suggestions(text).then((correct, suggestions, originalWords) => {
                flying.getTranslate(googleApiKey).translate(string).then(translated => {

                    const stem = DutchmanSnowball.stem(translated),
                        finalStem = flying.removeStopWords(stem, stopwordsArray_EN)
                            .split(" ")
                            .filter(function(n) {
                                return n != undefined && n != ""
                            });

                    resolve({
                        spelling: {
                            correct: correct,
                            suggestions: suggestions,
                            originalWords: originalWords
                        },
                        stem: finalStem
                    });
                },reject).catch(reject);
            }, reject).catch(reject);

        });
    }
});