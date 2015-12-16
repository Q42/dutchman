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
 * Methods available on the server
 * This class requires a valid Google API Key for it's most promising features,
 * namely the stem and generalize
 *
 * @class Meteor.DutchmanServer
 * @constructor
 */
Meteor.DutchmanServer = class {

    constructor(googleApiKey) {

        check(googleApiKey, String);
        this.googleApiKey = googleApiKey;
    }

    /**
     * @method stem
     * @param {String} input The string to be split and stemmed
     * @return {Array} returns an array containing all valid stems
     */
    stem(input) {

        const these = this;
        return new Promise((resolve, reject) => {

            try {
                check(these.googleApiKey, String);
                check(input, String);
            } catch (err) {
                reject(err);
            }

            const string = FlyingDutchman.removeStopWords(
                FlyingDutchman.cleanString(input), stopwordsArray_NL);

            FlyingDutchman.getTranslate(these.googleApiKey)
                .translate(string)
                // Translate to english
                .then(translated => {
                    resolve(FlyingDutchman.getCleanArray(
                        // Stem the word
                        DutchmanSnowball.stem(
                            // Transform to past participle
                            DutchmanTense.toPastParticiple(
                                // Remove english stopwords
                                FlyingDutchman.removeStopWords(
                                    translated,
                                    stopwordsArray_EN)))));
                },reject);
        });
    }

    /**
     * @method checkSpelling
     * @param {String} input The string to be checked
     * @return {Object} returns an object with summarized data
     */
    checkSpelling(input) {

        check(input, String);
        return new Promise((resolve, reject) => {
            const words = FlyingDutchman.getCleanArray(
                FlyingDutchman.cleanString(input)
            );
            let wordIteration = [];
            words.forEach(word => {
                wordIteration.push(FlyingDutchman.getHunspell().suggestions(word))
            });
            Promise.all(wordIteration).then((result) => {
                resolve(result);
            },(err) => {
                reject(err);
            });
        });
    }

    /**
     *
     *
     * @method getSynonyms
     * @param {String} input The string to be torn apart and fetch synonyms for
     * @param {String} amountToGet The amount of synonyms to get per word
     * @return {Array} returns an array with arrays of synonyms per word in the inserted string
     */
    synonyms(input, amountToGet) {

        const these = this;
        const amount = amountToGet || 5;
        check(input, String);

        return new Promise((resolve, reject) => {
            FlyingDutchman.getTranslate(these.googleApiKey)
                .translate(FlyingDutchman.removeStopWords(input, stopwordsArray_NL))
                // Translate to english
                .then(translated => {

                    const words = FlyingDutchman.getCleanArray(FlyingDutchman.removeStopWords(
                        FlyingDutchman.cleanString(translated), stopwordsArray_EN));

                    let wordIteration = [];
                    words.forEach(word => {
                        wordIteration.push(DutchmanSynonyms.getSynonyms(word, amount))
                    });
                    Promise.all(wordIteration).then((result) => {
                        let out = [];
                        result.forEach((synonymArray) => {
                            out.push(FlyingDutchman.getCleanArray(
                                // Stem the word
                                DutchmanSnowball.stem(
                                    // Transform to past participle
                                    DutchmanTense.toPastParticiple(synonymArray.join(" ")))));
                        });
                        resolve(out);
                    }, (err) => {
                        reject(err);
                    });
                });
        });
    }
};