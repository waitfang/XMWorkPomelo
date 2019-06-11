var crc = require('crc');

module.exports.dispatch = function(uid, connectors) {
    // console.log("dispatch======="+uid);
    var uid = uid ? (uid || '') : '0';
    console.log("uid======="+uid);
    var index = Math.abs(crc.crc32(uid)) % connectors.length;
    return connectors[index];
};