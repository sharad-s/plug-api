const SoundCloud = require('soundcloud-api-client');
const config = require('config');
const CLIENT_ID = config.get('SOUNDCLOUD_CLIENT_KEY');

const soundcloud = new SoundCloud({ CLIENT_ID });

const resolveURL = async (soundcloudURL) => {
    try { 
        const response = await soundcloud.get('/resolve', { soundcloudURL })
        return response;
    } catch (err) {
        throw new Error("Could Not Resolve URL:", soundcloudURL)
    }
}


module.exports = {
    resolveURL
}