const SoundCloud = require("soundcloud-api-client");
const CLIENT_ID ="47159083054685525f6b73d25e2560b9"

const soundcloud = new SoundCloud({ CLIENT_ID });


const username = 'jodywisternoff';
const url = `http://soundcloud.com/${username}`;
const limit = 10;


const validSoundcloudURL = async function(req, res, next) {
  const { soundcloudURL } = req.body;
  if (!soundcloudURL) return res.status(401).send("No URL provided.");

  try {
    const response = await soundcloud.get('/resolve', { url })
    console.log(response)
    return next();
  } catch (err) {
    console.log(err);
    return res.status(404).send(`Could Not Resolve URL: ${soundcloudURL}`);
  }
};

module.exports = validSoundcloudURL;
