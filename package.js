Package.describe({
  name: 'q42:dutchman',
  version: '0.2.5',
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
  api.versionsFrom('1.3');
  api.use('ecmascript');
  api.mainModule('client/dutchman.js', 'client');
  api.mainModule('server/dutchman.js', 'server');
  api.export('DutchmanClient');
  api.export('DutchmanServer');
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
