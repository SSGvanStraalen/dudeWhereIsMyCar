'use strict'
var copydir = require('copy-dir');

var folders = [
    {
      from: './src',
      to: `./dist`
    }
  ];


console.log('copy files');
const promiseMap = folders.map(folder => {
  let promise = new Promise(function(resolve){
    copydir(folder.from, folder.to, function(err){
      resolve();
    });
  });
  return promise;
});

Promise.all(promiseMap).then(function(values) {
  console.log('files are copied');
});
