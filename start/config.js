const config = require('config');

module.exports = () => {
    if (!config.get("db")) {
        throw new Error('DATABASE NOT DEFINED');
    }
    else if (!config.get('jwtPrivateKey')) {
        throw new Error('jwtPrivateKey not defined');
    }
}