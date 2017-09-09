var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers.js');
var httpHelpers = require('./http-helpers.js');
// require more modules/folders here!

var handleRequest = function (req, res) {

  if (req.method === 'GET' && req.url === '/') { //grab the homepage
    fs.readFile( archive.paths.siteAssets+'/index.html' , (err, data) => {
      if(err){
        res.writeHead(404, archive.headers);
        res.end("404: NOT FOUND");
      }
      httpHelpers.serveAssets(res, data);
    });
  } else if (req.method === 'GET') {
    console.log(archive.paths.archivedSites + req.url);
    fs.readFile( archive.paths.archivedSites + req.url , (err, data) => {
      if(err){
        res.writeHead(404, archive.headers);
        res.end("404: NOT FOUND");
      }
      httpHelpers.serveAssets(res, data);
    });
  } else if (req.method === 'POST' ) {
    var fixturePath = archive.paths.list;
    req.on('data', (data) => {
      fs.writeFileSync(fixturePath, data.toString().split('=')[1] + '\n');
      res.writeHead(302, archive.headers);
      res.end("302: FOUND");
    });

  }

};

module.exports.handleRequest = handleRequest;
