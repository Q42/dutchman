'use strict';

const   Snowball    = Npm.require("snowball"),
        stemmer     = new Snowball('English');

this.DutchmanSnowball = class {

    static stem(string) {
        check(string, String);
        const perWord = string.split(" ");
        let stemmed = [];

        perWord.forEach(toStem => {
            stemmer.setCurrent(toStem);
            stemmer.stem();
            stemmed.push(stemmer.getCurrent());
        });

        return stemmed.join(" ");
    }
};