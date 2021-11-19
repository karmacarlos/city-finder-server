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
  
  const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=20&countryIds=Q30&minPopulation=${minPopulation}`
  const options = {
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
      "x-rapidapi-key": process.env.S3_GEO
    }
  }
   const fetchResponse = await fetch(url, options)
   const data = await fetchResponse.json() 

  res.json(data)
})

app.get('/wiki/:fetchQuery', async (req,res) => {
  const fetchQuery = req.params.fetchQuery
  const options = {
    "method": "GET"
  }
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${fetchQuery}`

  const fetchResponse = await fetch(url, options)
  const data = await fetchResponse.json()

  res.json(data)
})

app.get('/walkScores/:city/:state/:lat/:lon', async (req, res) => {
  const city = req.params.city
  const state = req.params.state
  const latitude = req.params.lat
  const longitude = req.params.lon

  const url = `https://api.walkscore.com/score?format=json&address=${city}%20${state}&lat=${latitude}&lon=${longitude}&transit=1&bike=1&wsapikey=${process.env.S3_WALK}`
  const options = {
    "method": "GET"
  }

  const fetchResponse = await fetch(url, options)
  const data = await fetchResponse.json()

  res.json(data)
})

app.listen(app.get('port'), () => {
  console.log(`Server proxy over on http://localhost:${app.get('port')}`)
})