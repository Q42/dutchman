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

import FlyingDutchman from '../lib/flying'
import Stopwords from '../lib/etc/stopwords'
import DutchmanHunspell from './helpers/hunspell'
import DutchmanSnowball from './helpers/snowball'
import DutchmanSynonyms from './helpers/synonyms'
import DutchmanTense from './helpers/tense'
import DutchmanTranslate from './helpers/translate'

/**
 * Methods available on the server
 * This class requires a valid Google API Key for it's most promising features,
 * namely the stem and generalize
 *
 * @class Meteor.DutchmanServer
 * @constructor
 */
class DutchmanServer {

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

            const cleanString = FlyingDutchman.cleanString(input);
            const withoutStopwords = FlyingDutchman.removeStopWords(
                cleanString,
                Stopwords.NL());

            // Translate to English to be able to do algorithmic stemming
            DutchmanServer.getTranslate(these.googleApiKey)
                .translate(withoutStopwords)
                .then(translated => {
                    const translatedWithoutStopwords = FlyingDutchman.removeStopWords(
                        translated,
                        Stopwords.EN());
                    const pastParticiple = DutchmanTense.toPastParticiple(
                        translatedWithoutStopwords);
                    const stemmed = DutchmanSnowball.stem(
                        pastParticiple);
                    const cleanedArray = FlyingDutchman.getCleanArray(
                        stemmed);
                    resolve(cleanedArray);
                }, reject);
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
                wordIteration.push(DutchmanServer.getHunspell().suggestions(word))
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
            DutchmanServer.getTranslate(these.googleApiKey)
                .translate(FlyingDutchman.removeStopWords(input, Stopwords.NL()))
                // Translate to english
                .then(translated => {

                    const words = FlyingDutchman.getCleanArray(FlyingDutchman.removeStopWords(
                        FlyingDutchman.cleanString(translated), Stopwords.EN()));

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
};

export default DutchmanServer;
