module.exports = (title, message) => {
    var push = require('pushsafer-notifications');
    const config = require('./config.json');

    var p = new push({
        k: config.pushsaferSecret, // your 20 chars long private key 
        debug: false
    });

    var msg = {
        m: `${title}:\n${message}`, // message (required)
        s: '8', // sound (value 0-50) 
        v: '1', // vibration (empty or value 1-3) 
        i: '5', // icon (value 1-176)
        c: '#FF0000', // iconcolor (optional)
        d: '38551' // the device or device group id 
    };

    p.send(msg);
}