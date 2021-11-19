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
import * as AWS from 'aws-sdk'


app.get('/geoDB/:minPopulation', async (req, res) => {
  const minPopulation = req.params.minPopulation
  console.log('geoDB endpoint')
  const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=20&countryIds=Q30&minPopulation=${minPopulation}`
  const options = {
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
      "x-rapidapi-key": process.env.S3_GEO
    }
  }
   const fetchResponse = await fetch(url, options)
    .then(res => res.json())
    .catch(error => {
      console.error({
        "message": "Oh no",
        error: error
      })
    })
  console.log("RESPONSE: ", fetchResponse)
  res.json(fetchResponse)
    
   
  //  .then(externalResponse => {
  //    console.log('external log',JSON.parse(externalResponse))
  //   response.send(externalResponse)
  // })
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
  fetch(`https://api.walkscore.com/score?format=json&address=${city}%20${state}&lat=${latitude}&lon=${longitude}&transit=1&bike=1&wsapikey=${process.env.S3_WALK}`)
  .then(externalResponse => {
    console.log(externalResponse)
    response.send(externalResponse)
  })
})

app.listen(app.get('port'), () => {
  console.log(`Environment api keys variables over on http://localhost:${app.get('port')}`)
})