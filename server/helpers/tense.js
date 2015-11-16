/**
 * Dutchman
 * A Dutch linguistics utility library
 * by Q42
 * -----------------------------------
 * Modification of the tensify npm library so it would match dutchman's needs
 *
 * @package   q42:dutchman
 * @author    Jimmy Aupperlee <jimmy@q42.nl>
 * @license   https://github.com/Q42/meteor-dutchman/blob/master/LICENSE  MIT
 * @link      https://atmospherejs.com/q42/dutchman
 */

'use strict';

const presentVerbInflector = new (Npm.require('natural').PresentVerbInflector),
    symbols = Npm.require('symbols');


this.DutchmanTense = class {

    static toPastParticiple(string) {
        check(string, String);
        const perWord = string.split(" ");
        let processed = [];

        perWord.forEach((word) =>  {
            const tense = new DutchmanTense(word);
            processed.push(tense.pastParticiple);
        });

        return processed.join(" ");
    }

    constructor(verb) {
        let past, pastParticiple;

        // Normalize verb to simple plural form
        const verbToCheck = presentVerbInflector.pluralize(verb);
        // Attempt to find irregular verb
        const irregular = this.findIrregularVerb(verbToCheck);

        if (irregular) {
            past = irregular[0];
            pastParticiple = irregular[1];
        } else {
            past = pastParticiple = this.edify(verbToCheck);
        }

        this.past = past;
        this.pastParticiple = pastParticiple;
    }

    findIrregularVerb(verb) {
        for (let i in irregularVerbs) {
            if (irregularVerbs[i].indexOf(verb) !== -1) {
                return irregularVerbs[i].slice(-2);
            }
        }
        return false;
    }

    endsWithC(verb) {
        return verb[verb.length - 1].toLowerCase() === 'c';
    }

    endsWithConsonantPlusY(verb) {
        const last = verb.length - 1;
        return verb[last].toLowerCase() === 'y'
            && symbols.is_consonant(verb[last - 1]);
    }

    endsWithE(verb) {
        return verb[verb.length - 1].toLowerCase() === 'e';
    }

    endsWithTwoVowelsConsonant(verb) {
        const last = verb.length - 1;

        return symbols.is_consonant(verb[last])
            && symbols.is_vovel(verb[last - 1])
            && symbols.is_vovel(verb[last - 2]);
    }

    alreadyPast(verb) {
        return verb.slice(-2) === 'ed'
            && verb != 'embed';
    }

    edify(verb) {
        switch (true) {
            case this.alreadyPast(verb):
                return verb;

            case this.endsWithC(verb):
                return verb + 'ked';

            case this.endsWithConsonantPlusY(verb):
                return verb.slice(0, -1) + 'ied';

            case this.endsWithE(verb):
                return verb + 'd';

            case this.endsWithTwoVowelsConsonant(verb):
                return verb + 'ed';

            case this.singleVowelConsonant(verb) && this.stressEnd(verb):
                return verb + verb[verb.length - 1] + 'ed';

            default:
                return verb + 'ed';
        }
    }

    singleVowelConsonant(verb) {
        const last = verb.length - 1;

        return symbols.is_consonant(verb[last])
            && symbols.is_vovel(verb[last - 1])
            && !symbols.is_vovel(verb[last - 2])
            && verb[last] !== 'w'
            && verb[last] !== 'x';
    }

    stressEnd(word) {
        return stressWords.indexOf(word) === -1;
    }
};