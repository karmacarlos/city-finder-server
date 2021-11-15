const express = require('express');
// import express from 'express'
const app = express();
const cors = require('cors')
// import cors from 'cors'
app.use(cors())
app.use(express.json())
// import dotenv from 'dotenv'
const dotenv = require('dotenv')
dotenv.config()
const fetch = require('node-fetch')
// import fetch from 'node-fetch';

app.set('port', process.env.PORT || 3001);

const geoDBkey = JSON.stringify(process.env.GEODB_KEY);
const walkScoreKey = JSON.stringify(process.env.WALKSCORE_KEY);


app.get('/geoDB/:minPopulation', (request, response) => {
  const minPopulation = request.params.minPopulation
   fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=15&countryIds=Q30&minPopulation=${minPopulation}`, {
            "method": "GET",
            "headers": {
              "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
              "x-rapidapi-key": "44656b2a0amsh452d224010c54d1p19fbd8jsn1b29912aa129",
                }
   })
   .then(externalResponse => response.send(externalResponse))
  
  // response.status(200).json( { minPopulation } )
  // console.log( request.params )
  // response.send( { request.params } )
})


app.listen(app.get('port'), () => {
  console.log(`Environment api keys variables over on http://localhost:${app.get('port')}`);
});