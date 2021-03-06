const { addRaster, addVector, gpkgOut, mapsetExists, isLegalName } = require('../grass.js')
const { checkWritableDir } = require('../helpers.js')
const translations = require(`../../i18n/messages.${process.env.USE_LANG || 'en'}.json`)

const GEOSERVER = `${process.env.GEOSERVER_DATA_DIR}/data`

module.exports = class {
  constructor() {
    this.mapType = '' // 'vector' or 'raster'
    this.mapFile = '' // filename of uploaded file
  }

  launch() {
    checkWritableDir(GEOSERVER)

    if (mapsetExists('PERMANENT')) {
      return { id: 'add_map.2', message: translations['add_map.message.2'] }
    }
    return { id: 'add_map.1', message: translations['add_map.message.1'] }
  }

  process(message, replyTo) {
    switch (replyTo) {
      case 'add_map.2': {
        // uploaded file
        if (message.match(/\.geojson$|\.gpkg$|\.osm$/i)) {
          this.mapType = 'vector'
        } else if (message.match(/\.tiff?$|\.gtif$/i)) {
          this.mapType = 'raster'
        } else {
          throw new Error(translations['add_map.errors.1'])
        }

        this.mapFile = message

        const layerName = this.mapFile.slice(this.mapFile.lastIndexOf('/') + 1, this.mapFile.lastIndexOf('.'))

        try {
          isLegalName(layerName)
        } catch (err) {
          throw new Error(translations['add_map.errors.2'])
        }

        return {
          id: 'add_map.3',
          message: translations['add_map.message.3'],
          layerName: layerName
        }
      }

      case 'add_map.3':
        if (!this.mapFile) {
          throw new Error(translations['add_map.errors.3'])
        }

        if (this.mapType === 'vector') {
          addVector('PERMANENT', this.mapFile, message)
          gpkgOut('PERMANENT', message, message)
        } else if (this.mapType === 'raster') {
          addRaster('PERMANENT', this.mapFile, message)
        }
        return { id: 'add_map.4', message: translations['add_map.message.4'] }
    }
  }
}
