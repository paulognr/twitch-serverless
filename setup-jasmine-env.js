const reporters = require('jasmine-reporters');
const junitReporter = new reporters.JUnitXmlReporter({  
  savePath: __dirname + '/test-reports',
  filePrefix: 'test-result-',
  consolidateAll: false,
});
jasmine.getEnv().addReporter(junitReporter);