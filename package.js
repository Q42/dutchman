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
  "snowball" : "~0.3",
  "nodehun" : "~2.0.8",
  "dictionary-nl": "~1.0.1"
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.addFiles('dutchman.js');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('jimmy:dutchman');
  api.addFiles('dutchman-tests.js');
});
