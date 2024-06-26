const test = require('tap').test;
const fs = require('fs');
const path = require('path');
const streamBuffers = require("stream-buffers");
const unzip = require('../');

test("pipe a single file entry out of a zip", function (t) {
  const archive = path.join(__dirname, '../testData/compressed-standard/archive.zip');

  fs.createReadStream(archive)
    .pipe(unzip.Parse())
    .on('entry', function(entry) {
      if (entry.path === 'file.txt') {
        const writableStream = new streamBuffers.WritableStreamBuffer();
        writableStream.on('close', function () {
          const str = writableStream.getContentsAsString('utf8');
          const fileStr = fs.readFileSync(path.join(__dirname, '../testData/compressed-standard/inflated/file.txt'), 'utf8');
          t.equal(str, fileStr);
          t.end();
        });
        entry.pipe(writableStream);
      } else {
        entry.autodrain();
      }
    });
});