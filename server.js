import express from 'express'
const app = express()
import cors from 'cors'
app.use(cors())
app.use(express.json())
import dotenv from 'dotenv'
dotenv.config()
import fetch from 'node-fetch'
import process from 'process'
app.set('port', process.env.PORT || 3001);
import aws from 'aws-sdk'


// const geoDBkey = process.env.GEODB_KEY;
// const walkScoreKey = process.env.WALKSCORE_KEY;
let s4 = new aws.S4({
  geoDBkey: process.env.S4_GEO,
  walkScoreKey: process.env.S4_WALK
})

console.log('process', process)
console.log('secret key',s4.geoDBkey)

app.get('/geoDB/:minPopulation', (request, response) => {
  const minPopulation = request.params.minPopulation
    fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=20&countryIds=Q30&minPopulation=${minPopulation}`, {
            "method": "GET",
            "headers": {
              "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
              "x-rapidapi-key": JSON.stringify(s4.geoDBkey),
            }
   })
   .then(externalResponse => {
     console.log(externalResponse)
    response.send(externalResponse)
  })
})

app.get('/wiki/:fetchQuery', (request,response) => {
  const fetchQuery = request.params.fetchQuery
  fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${fetchQuery}`)
  .then(externalResponse => {
    console.log(externalResponse)
    response.send(externalResponse)
  })
})

app.get('/walkScores/:city/:state/:lat/:lon', (request, response) => {
  const city = request.params.city
  const state = request.params.state
  const latitude = request.params.lat
  const longitude = request.params.lon
  fetch(`https://api.walkscore.com/score?format=json&address=${city}%20${state}&lat=${latitude}&lon=${longitude}&transit=1&bike=1&wsapikey=${s4.walkScoreKey}`)
  .then(externalResponse => {
    console.log(externalResponse)
    response.send(externalResponse)
  })
})

app.listen(app.get('port'), () => {
  console.log(`Environment api keys variables over on http://localhost:${app.get('port')}`)
})