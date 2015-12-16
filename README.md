# Dutchman
__A Dutch linguistics utility meteor package__

[![Build Status][travis-image]][travis-url]

## Getting started

Add the package to meteor
```
meteor add q42:dutchman
```

## Basic usage

Dutchman has some features on the client and on the server side of Meteor. 
During its usage I discovered that most of its features are used on the Server (e.g. to search a database or add stems to the database).
Therefore most of it's features are only available on the server side. 

## Client

### Constructing
```
const dutchman = new Meteor.DutchmanClient();
```

### Remove stopwords
__Removes stopwords__ like: "The/De", "The/Het", "A/een", "Because/Want", "So/Dus".
Complete lists of stopwords can be found in the lib folder.
```
// removeStopWords(string, lang)
// The lang can either be 'en' or 'nl' at the moment. Default is nl.
dutchman.removeStopWords("Some string", "nl");
```

## Server

All methods on the server side are using forms a asynchronous calls. 
Therefore they return a Promise immediately which you can then utilize.

### Constructing
Dutchman uses __Google Translate__ internally to translate the entire sentence to English before processing it.
Therefore it needs a __Google API key__ which should be inserted in the constructor.
```
const dutchman = new Meteor.DutchmanServer("GOOGLE API KEY");
```

### Get Stemming
```
dutchman.stem("Ik heb een stukje meteor geprogrammeerd.").then((stemArray) => {
    // Use your array of stems here
}), function(err){
    console.log(err);
});
```
returns
```
["slice", "meteor", "program"]
```

### Check Spelling (experimental)

The details returned by the spelling checker is an object containing all the words of the sentence seperately as a key with a boolean as a value.
The boolean is representing whether or not the sentence was correctly spelled.
```
dutchman.checkSpelling("Ik heb een stukje meteor geprogramaard.").then((detailObject) => {
    // Use your details here
}), function(err){
    console.log(err);
});
```
returns 
```
{
  {correct: true},
  {correct: true},
  {correct: true},
  {correct: true},
  {correct: true},
  {
    correct: false,
    originalWord: "geprogramaard",
    suggestions: ["geprogrammeerd", "gedeprogrammeerd", "deprogrammeerde", "programakkoord"]
  },
}
```

### Get Synonyms

The synonyms fetched from the individual words of the sentence are also stemmed in the process. 
This way you can instantly use them to find stuff related to this sentence.
The array returned contains arrays of synonyms.
```
// synonyms("A string containing words from which you want synonyms", synonymAmount);
dutchman.synonyms("Some words", 5).then((synonyms) => {
    // Use the synonyms here
}), function(err){
    console.log(err);
});
```

[travis-url]: https://travis-ci.org/Q42/meteor-dutchman
[travis-image]: http://img.shields.io/travis/Q42/meteor-dutchman.svg
