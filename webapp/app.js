// Read config
require('dotenv').config()

const dataFromBrowserDir = process.env.DATA_FROM_BROWSER_DIR
const geoserverDataDir = process.env.GEOSERVER_DATA_DIR
const geoserverUrl = process.env.GEOSERVER_URL
const OUTPUT_DIR = process.env.OUTPUT_DIR
const lat = process.env.INITIAL_LAT || 0
const lon = process.env.INITIAL_LON || 0

const translations = require(`./i18n/messages.${process.env.USE_LANG || 'en'}.json`)

// File system
const fs = require('fs')
const path = require('path');

// Express server
const express = require('express')
require('pug')
const app = express()
const expressPort = 3000

// Middleware
const jsonParser = require('body-parser').json()
const multer = require('multer')
const uploadParser = multer()

app.listen(expressPort, () => {
  console.log(`App listening on port ${expressPort}`)
})

// Static files
app.use(express.static('public'))
app.use('/output', express.static('../output'))
app.use('/lib/jquery', express.static('node_modules/jquery/dist'))
app.use('/lib/bootstrap', express.static('node_modules/bootstrap/dist'))
app.use('/lib/leaflet', express.static('node_modules/leaflet/dist'))
app.use('/lib/leaflet-draw', express.static('node_modules/leaflet-draw/dist'))
app.use('/lib/leaflet-groupedlayercontrol', express.static('node_modules/leaflet-groupedlayercontrol/src'))
app.use('/lib/leaflet-measure', express.static('node_modules/leaflet-measure/dist'));
app.use('/lib/leaflet-plugins', express.static('./leaflet-plugins'))
app.use('/lib/split', express.static('node_modules/split.js/dist'))

// Views (using Pug template engine)
app.set('views', './views')
app.set('view engine', 'pug')

// index page
app.get('/', (req, res) => {
  let options = {
    geoserverUrl,
    lat,
    lon,
    t: translations
  }
  res.render('launch', options)
})

// functions
const { getMetadata } = require('./scripts/grass')
const { getResults } = require('./scripts/helpers')

// modules
const AddLocationModule = require('./scripts/modules/add_location')
const AddMapModule = require('./scripts/modules/add_map')
const SetSelectionModule = require('./scripts/modules/set_selection')
const SetResolutionModule = require('./scripts/modules/set_resolution')
const TimeMapModule = require('./scripts/modules/time_map')
const QueryModule = require('./scripts/modules/query')
const LatacungaModule = require('./scripts/modules/cotopaxi_scenarios')

const modules = {
  "add_location": new AddLocationModule(),
  "add_map": new AddMapModule(),
  "set_selection": new SetSelectionModule(),
  "set_resolution": new SetResolutionModule(),
  "time_map": new TimeMapModule(),
  "query": new QueryModule(),
  "cotopaxi_scenarios": new LatacungaModule()
}

// launch a module
app.post('/launch', jsonParser, (req, res, next) => {
  // do some checks first
  if (!dataFromBrowserDir) {
    throw new Error("Cannot launch module: DATA_FROM_BROWSER_DIR is not defined.")
  }
  if (!geoserverDataDir) {
    throw new Error("Cannot launch module: GEOSERVER_DATA_DIR is not defined.")
  }

  try {
    res.send(modules[req.body.launch].launch())
  } catch (err) {
    next(err)
  }
})

// message request
app.post('/reply', jsonParser, (req, res, next) => {
  try {
    const module = modules[req.query.messageId.split('.')[0]]
    const message = module.process(req.body.msg, req.query.messageId)

    if (message) {
      res.send(message)
    } else {
      next("Something went wrong")
    }
  } catch (err) {
    next(err)
  }
})

// file upload
app.post('/file', uploadParser.single('file'), (req, res, next) => {
  try {
    const module = modules[req.query.messageId.split('.')[0]]
    const file = `${dataFromBrowserDir}/${req.file.originalname}`
    const writer = fs.createWriteStream(file)

    writer.write(req.file.buffer, (error) => {
      if (error) {
        next(error)
      }
      writer.close()

      // Process file after it's finished downloading.
      // Have to add another try/catch block, as we're inside an async function
      try {
        const message = module.process(file, req.query.messageId)

        if (message) {
          res.send(message)
        } else {
          next("Something went wrong")
        }
      } catch (err) {
        next(err)
      }
    })
  } catch (err) {
    next(err)
  }
})

// send a GeoJSON
app.post('/drawing', jsonParser, (req, res, next) => {
  try {
    const module = modules[req.query.messageId.split('.')[0]]
    const file = `${dataFromBrowserDir}/drawing.geojson`

    fs.writeFileSync(file, JSON.stringify(req.body.data))
    res.send(module.process(file, req.query.messageId))
  } catch (err) {
    next(err)
  }
})

// return all output filenames
app.get('/output', jsonParser, (req, res, next) => {
  try {
    const list = getResults()
    res.json({ list })
  } catch (err) {
    next(err)
  }
})

// delete file from OUTPUT_DIR
app.delete('/output', jsonParser, (req, res, next) => {
  try {
    fs.unlinkSync(`${OUTPUT_DIR}/${req.query.file}`)
    res.json({ message: `${req.query.file} deleted!` })
  } catch (err) {
    next(err)
  }
})

// delete all files in OUTPUT_DIR
app.delete('/output-all', jsonParser, (req, res, next) => {
  try {
    fs.readdir(OUTPUT_DIR, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlink(path.join(OUTPUT_DIR, file), err => {
          if (err) throw err;
        });
      }
    });
    res.json({ message: 'output folder emptied!' })
  } catch (err) {
    next(err)
  }
})

// return all attribute descriptions of a table
app.get('/attributes', jsonParser, async (req, res, next) => {
  try {
    const attributes = getMetadata('PERMANENT', req.query.table)
    res.json({ attributes })
  } catch (err) {
    next(err)
  }
})

// error handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  res.status(500)

  // GRASS errors
  let grassError = ''
  if (err.message && err.message.match(/Starting GRASS GIS/)) {
    let errorMessageOngoing = false
    for (const line of err.message.split('\n')) {
      const errorMatch = line.match(/^ERROR/)
      if (errorMatch) {
        errorMessageOngoing = true
      }
      if (!errorMatch && !line.match(/^\s/)) {
        errorMessageOngoing = false
      }
      if (errorMessageOngoing) {
        grassError += line + ' '
      }
    }
  }

  res.json({ message: grassError || err.message })
})
