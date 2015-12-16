Package.describe({
  name: 'q42:dutchman',
  version: '0.2.2',
  summary: 'A Dutch linguistics utility library',
  git: 'https://github.com/Q42/dutchman',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({
  "google-translate": "1.0.2",
  "snowball": "0.3.1",
  "nodehun" : "2.0.8",
  "dictionary-nl": "1.0.1",
  "find-synonyms": "0.0.1",
  "natural": "0.2.1",
  "symbols": "0.0.3"
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  // Specify the source code for the package.
  api.addFiles([
    'server/dutchman.js',
    'server/helpers/hunspell.js',
    'server/helpers/snowball.js',
    'server/helpers/translate.js',
    'server/helpers/synonyms.js',
    'server/helpers/tense.js'],
    'server');
  api.addFiles([
    'lib/etc/stopwords.js',
    'lib/etc/verbs.js',
    'lib/flying.js'],[
    'client',
    'server']
  );
  api.addFiles(
    'client/dutchman.js',
    'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('ecmascript');
  api.use('q42:dutchman');
  // Tests will follow soon!
  api.addFiles([
    'test/client/dutchman.test.js'
  ]);
});
