const fs = require('fs')
const { addVector, dbSelectAllRaw, dbSelectAllObj, getAllColumns, getUnivarBounds, gpkgOut, grass, initMapset, listUserVector, listVector, mapsetExists, remove, isLegalName } = require('../grass')
const { checkWritableDir, filterDefaultLayerFilenames, getFilesOfType, mergePDFs, psToPDF, textToPS } = require('../helpers')
const translations = require(`../../i18n/messages.${process.env.USE_LANG || 'en'}.json`)

const GEOSERVER = `${process.env.GEOSERVER_DATA_DIR}/data`
const GRASS = process.env.GRASS_DIR
const OUTPUT = process.env.OUTPUT_DIR

const QUERY_RESOLUTION = 0.00002
const QUERY_MAP_NAME = 'query_map'
const QUERY_RESULT_NAME = 'query_result'

module.exports = class {
  constructor() {
    this.mapset = 'query'
  }

  launch() {
    checkWritableDir(GEOSERVER)
    checkWritableDir(OUTPUT)

    if (!mapsetExists('PERMANENT')) {
      return { id: 'query.7', message: translations['query.message.7'] }
    }

    initMapset(this.mapset)

    if (listVector('PERMANENT').indexOf('selection@PERMANENT') < 0) {
      return { id: 'query.1', message: translations['query.message.1'] }
    }

    // set selection as the query area
    grass(this.mapset, `g.copy vector=selection@PERMANENT,selection --overwrite`)
    this.queryArea = 'selection'

    const allVector = listUserVector().map(file => file.split('@')[0])
    const allGpkg = getFilesOfType('gpkg', GEOSERVER)
      .filter(filterDefaultLayerFilenames)
      .filter(name => !name.match(/\/m1_[a-z_]*\.gpkg/))

    /**
     * check and add all layers from layer switcher
     * FIXME: mapFile name and layer name differs, which makes it hard to check if file has already been imported
     * ideal solution: 1. make sure all map files contains only one layer; 2. make sure all mapFile names align with its layer's name
     */
    for (const mapFile of allGpkg) {
      const fileName = mapFile.slice(mapFile.lastIndexOf('/') + 1, mapFile.lastIndexOf('.')).replace(' ', '_')
      if (allVector.indexOf(fileName) > -1) {
        continue
      }
      if (isLegalName(fileName)) {
        addVector('PERMANENT', mapFile, fileName)
      }
      // PENDING: handle single-layer AND multi-layer import
      // const inLayers = getLayers('PERMANENT', mapFile)
      // // GRASS doesn't allow space in layernames
      // const grassLayers = inLayers.map(layer => layer.replace(' ', '_'))
      // // single-layered mapFiles
      // if (inLayers.length === 1) {
      //   // using mapFile name as GRASS layer name for single-layered mapFiles
      //   addVector('PERMANENT', mapFile, fileName)
      // }
      // // multi-layered mapFiles
      // else if (inLayers.length > 1) {
      //   grassLayers.forEach((gLayer, i) => {
      //     // check if this layer has already been imported
      //     if (allVector.indexOf(gLayer) < 0) {
      //       // using layer name in original mapFile as GRASS layer name
      //       addVector('PERMANENT', mapFile, gLayer, inLayers[i])
      //     }
      //   })
      // }
    }

    return {
      id: 'query.2',
      message: translations['query.message.2'],
      list: listUserVector().map(file => file.split('@')[0])
    }
  }

  process(message, replyTo) {
    switch (replyTo) {
      case 'query.2': {
        this.mapToQuery = message

        // remove old query_map
        remove(this.mapset, QUERY_MAP_NAME)

        // Now it is possible to check if the map to query is in the default mapset 'query' or not. If not, the map has to be copied into the query mapset.
        if (grass('PERMANENT', `g.list type=vector mapset=${this.mapset}`).split('\n').indexOf(this.mapToQuery) == -1) {
          grass(this.mapset, `g.copy vector=${this.mapToQuery}@PERMANENT,${QUERY_MAP_NAME}`)
        } else {
          grass(this.mapset, `g.copy vector=${this.mapToQuery}@${this.mapset},${QUERY_MAP_NAME}`)
        }

        gpkgOut(this.mapset, QUERY_MAP_NAME, QUERY_MAP_NAME)

        const vals = dbSelectAllObj(this.mapset, QUERY_MAP_NAME)
        const cols = getAllColumns(this.mapset, QUERY_MAP_NAME).reduce((arr, column) => {
          // if column is numeric, get bounds
          if (['DOUBLE PRECISION', 'INTEGER'].indexOf(column.type) > -1) {
            const bounds = getUnivarBounds(this.mapset, QUERY_MAP_NAME, column.column)
            // only add column with valid value entries
            if (bounds.indexOf('not provided') < 0) {
              column['bounds'] = bounds
              arr.push(column)
            }
          }
          // if column is text, get values
          else {
            column.vals = [...new Set(vals.map(c => c[column.column]))]
            arr.push(column)
          }
          return arr
        }, [])

        return {
          id: 'query.3',
          message: translations['query.message.3'],
          list: cols,
          map: this.mapToQuery
        }
      }

      case 'query.3': {
        const where = message.reduce((sum, msg) => sum + msg.where + ' ', '').trim()
        this.calculate(message, where)

        return {
          id: 'query.24',
          message: translations['query.message.24'],
          result: this.outfile
        }
      }
    }
  }

  calculate(message, where) {
    this.outfile = null;

    // remove old query_result
    remove(this.mapset, QUERY_RESULT_NAME)

    // Set region to query area, set resolution
    grass(this.mapset, `g.region vector=${this.queryArea} res=${QUERY_RESOLUTION} --overwrite`)

    // Set mask to query area
    grass(this.mapset, `r.mask vector=${this.queryArea} --overwrite`)

    // Clip the basemep map by query area
    grass(this.mapset, `v.select ainput=${QUERY_MAP_NAME} atype=point,line,boundary,centroid,area binput=${this.queryArea} btype=area output=clipped_1 operator=overlap --overwrite`)

    // Apply the query request
    grass(this.mapset, `v.extract input=clipped_1 where="${where}" output=${QUERY_RESULT_NAME} --overwrite`)

    // // FIXME: if the part from line 151 can be removed, the stats can also be removed
    // // TODO: handle output when query_result is empty
    // // Query statistics
    // const stats = getUnivar(this.mapset, QUERY_RESULT_NAME, queryColumn)
    // Data output
    gpkgOut(this.mapset, QUERY_RESULT_NAME, QUERY_RESULT_NAME)

    // Generate PDF
    const date = new Date()
    const dateString = date.toString()
    const safeDateString = date.toISOString().replace(/([\d-]*)T(\d\d):(\d\d):[\d.]*Z/g, '$1_$2$3')
    const entries = dbSelectAllRaw(this.mapset, QUERY_RESULT_NAME).split(' \n')
    let output = `Statistics and map results

${translations['query.output.2']}: ${dateString}
${translations['query.output.3']}: ${message.map(msg => msg.column).toString()}
${translations['query.output.4']}: ${where}
${translations['query.output.6']}: ${entries.length - 1}
List of features (only shows the first 30 features):
`
    if (entries.length <= 30) {
      output += entries.join('\n')
    } else {
      output += (entries.slice(0, 30).join('\n') + '\n')
    }

    fs.mkdirSync('tmp', { recursive: true })
    fs.writeFileSync('tmp/statistics_output', output)

    textToPS('tmp/statistics_output', 'tmp/statistics.ps')
    psToPDF('tmp/statistics.ps', 'tmp/statistics.pdf')

    grass(this.mapset, `ps.map input="${GRASS}/variables/defaults/query.ps_param" output=tmp/query_map.ps --overwrite`)
    psToPDF('tmp/query_map.ps', 'tmp/query_map.pdf')

    this.outfile = `query_results_${safeDateString}.pdf`;

    mergePDFs(`${OUTPUT}/${this.outfile}`, 'tmp/query_map.pdf', 'tmp/statistics.pdf')

    fs.rmdirSync('tmp', { recursive: true })

    return output
  }

}
