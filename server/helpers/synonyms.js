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

const synonyms = Npm.require('find-synonyms');

class DutchmanSynonyms {

    static getSynonyms(word, amountToGet) {
        const amount = amountToGet || 5;
        check(word, String);
        return new Promise((resolve) => {
            synonyms(word, amount, function (values) {
                resolve(values);
            });
        });
    }
};

export default DutchmanSynonyms;
