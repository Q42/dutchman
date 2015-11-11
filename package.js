Package.describe({
  name: 'jimmy:dutchman',
  version: '0.0.1',
  summary: 'A Dutch linguistics utility library created for Proud',
  git: 'https://github.com/Q42/dutchman',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({
  "google-translate": "1.0.2",
  "snowball": "0.3.1",
  "nodehun" : "2.0.8",
  "dictionary-nl": "1.0.1"
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  // Export the object 'Dutchman' to packages or apps that use this package.
  api.export('Dutchman');
  // Specify the source code for the package.
  api.addFiles([
    'server/flying.js',
    'server/vendor/hunspell.js',
    'server/vendor/snowball.js',
    'server/vendor/translate.js',
    'server/etc/stopwords.js'],
    'server');
  api.addFiles(
    'client/dutchman.js',
    'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('ecmascript');
  api.use('jimmy:dutchman');
  // Tests will follow soon!
  api.addFiles([
    'test/client/dutchman.test.js'
  ]);
});
