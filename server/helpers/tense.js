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

import FlyingDutchman from '../../lib/flying'
import Verbs from '../../lib/etc/verbs'

const presentVerbInflector = new (Npm.require('natural').PresentVerbInflector),
    symbols = Npm.require('symbols');


class DutchmanTense {

    static toPastParticiple(string) {
        check(string, String);
        const perWord = FlyingDutchman.cleanString(string).split(" ");
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
        const irregularVerbs = Verbs.irregularVerbs();
        for (let i in irregularVerbs) {
            if (irregularVerbs[i].indexOf(verb) !== -1) {
                return irregularVerbs[i].slice(-2);
            }
        }
        return false;
    }

    endsWithC(verb) {
        const char0FromEnd = verb.substr(-1, 1);
        return char0FromEnd.toLowerCase() === 'c';
    }

    endsWithConsonantPlusY(verb) {
        const char0FromEnd = verb.substr(-1, 1);
        const char1FromEnd = verb.substr(-2, 1);
        return char0FromEnd.toLowerCase() === 'y'
            && symbols.is_consonant(char1FromEnd);
    }

    endsWithE(verb) {
        const char0FromEnd = verb.substr(-1, 1);
        return char0FromEnd.toLowerCase() === 'e';
    }

    endsWithTwoVowelsConsonant(verb) {
        const char0FromEnd = verb.substr(-1, 1);
        const char1FromEnd = verb.substr(-2, 1);
        const char2FromEnd = verb.substr(-3, 1);

        return symbols.is_consonant(char0FromEnd)
            && symbols.is_vovel(char1FromEnd)
            && symbols.is_vovel(char2FromEnd);
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
                return verb + verb.substr(-1, 1) + 'ed';

            default:
                return verb + 'ed';
        }
    }

    singleVowelConsonant(verb) {
        const char0FromEnd = verb.substr(-1, 1);
        const char1FromEnd = verb.substr(-2, 1);
        const char2FromEnd = verb.substr(-3, 1);

        return symbols.is_consonant(char0FromEnd)
            && symbols.is_vovel(char1FromEnd)
            && !symbols.is_vovel(char2FromEnd)
            && char0FromEnd !== 'w'
            && char0FromEnd !== 'x';
    }

    stressEnd(word) {
        return Verbs.stressWords().indexOf(word) === -1;
    }
};

export default DutchmanTense;
