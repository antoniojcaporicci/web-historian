var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!


exports.readListOfUrls = function(callback) {
  fs.readFile(this.paths.list, 'utf8', (err, data) => {
    callback(data.split('\n'));
  });
};

exports.isUrlInList = function(url, callback) {
  fs.readFile(this.paths.list, 'utf8', (err, data) => {
    callback(data.split('\n').includes(url));
  });
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(this.paths.list, url + '\n', callback);
};

exports.isUrlArchived = function(url, callback) {
  fs.readFile(this.paths.archivedSites + '/' + url, 'utf8', (err, data) => {
    err ? callback(false) : callback(true);
  });
};

exports.downloadUrls = function(urls) {

  for (var i = 0; i < urls.length; i++) {
    this.isUrlArchived(urls[i], (fileExists) => {
      if (!fileExists) {
        //download
        http.get(urls[i], (res) => {
          let rawData = '';
          res.on('data', (chunk) => { rawData += chunk; });
          res.on('end', () => {
            try {
              // const parsedData = JSON.parse(rawData);
              console.log('RAWDATA$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$', rawData);
              //fs.writeFileSync(this.paths.archivedSites + '/' +  urls[i], parsedData);
            } catch (e){
              console.error(e.message);
            }
          });
        });
      }
    });
  }
};
