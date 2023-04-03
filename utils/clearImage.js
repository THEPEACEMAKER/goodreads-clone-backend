const fs = require('fs');
const path = require('path');

module.exports = (filePath) => {
    fs.unlink(filePath, (err) => {
        console.log('after');
        if (err) {
            throw err;
        }
        console.log('after2');

    });
}