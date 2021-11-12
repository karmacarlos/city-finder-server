const express = require('express');
const app = express();
require('dotenv').config()

app.set('port', process.env.PORT || 3001);

const geoDBkey = process.env.GEODB_KEY;
const walkScoreKey = process.env.WALKSCORE_KEY;


app.listen(app.get('port'), () => {
  console.log(`Environment api keys variables over on http://localhost:${app.get('port')}`);
});