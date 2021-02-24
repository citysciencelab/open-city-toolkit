const axios = require('axios')
const GEOSERVER_UPLOAD = `${process.env.GEOSERVER_DATA_DIR}/data/upload`
const GEOSERVER_URL = process.env.GEOSERVER_URL

const geoServer = axios.create({
  baseURL: GEOSERVER_URL + 'geoserver',
  auth: {
    username: process.env.GEOSERVER_USERNAME,
    password: process.env.GEOSERVER_PASSWORD
  }
})

/**
 * GeoServer data store class
 * API spec: https://docs.geoserver.org/stable/en/api/#1.0.0/datastores.yaml
 */
class DataStore {
  constructor(workspaceName, storeName, databaseFile, databaseFileFormat) {
    this.workspaceName = workspaceName
    this.storeName = storeName
    this.databaseFile = databaseFile
    this.databaseFileFormat = databaseFileFormat
  }

  getBody() {
    return {
      dataStore: {
        name: this.storeName,
        connectionParameters: {
          entry: [
            { "@key": "database", "$": `file://${GEOSERVER_UPLOAD}/${this.databaseFile}` },
            { "@key": "dbtype", "$": this.databaseFileFormat }
          ]
        }
      }
    }
  }

  post() {
    return geoServer.post(
      `/rest/workspaces/${this.workspaceName}/datastores`,
      this.getBody()
    )
  }
}

/**
 * GeoServer feature type class
 * API spec: https://docs.geoserver.org/stable/en/api/#1.0.0/featuretypes.yaml
 */
class FeatureType {
  constructor(workspaceName, storeName, featureTypeName) {
    this.workspaceName = workspaceName
    this.storeName = storeName
    this.featureTypeName = featureTypeName
  }

  getBody() {
    return {
      featureType: {
        "name": this.featureTypeName,
        "namespace": {
          "name": this.workspaceName,
          "href": `${GEOSERVER_URL}geoserver/rest/namespaces/${this.workspaceName}.json`
        },
        "title": this.featureTypeName,
        "keywords": {
          "string": [
            "features",
            this.featureTypeName
          ]
        },
        "nativeCRS": "GEOGCS[\"WGS 84\", \n  DATUM[\"World Geodetic System 1984\", \n    SPHEROID[\"WGS 84\", 6378137.0, 298.257223563, AUTHORITY[\"EPSG\",\"7030\"]], \n    AUTHORITY[\"EPSG\",\"6326\"]], \n  PRIMEM[\"Greenwich\", 0.0, AUTHORITY[\"EPSG\",\"8901\"]], \n  UNIT[\"degree\", 0.017453292519943295], \n  AXIS[\"Geodetic longitude\", EAST], \n  AXIS[\"Geodetic latitude\", NORTH], \n  AUTHORITY[\"EPSG\",\"4326\"]]",
        "srs": "EPSG:4326",
        "nativeBoundingBox": {
          "minx": -180,
          "maxx": 180,
          "miny": -90,
          "maxy": 90,
          "crs": "EPSG:4326"
        },
        "latLonBoundingBox": {
          "minx": -180,
          "maxx": 180,
          "miny": -90,
          "maxy": 90,
          "crs": "EPSG:4326"
        },
        "projectionPolicy": "FORCE_DECLARED",
        "enabled": true,
        "metadata": {
          "entry": {
            "@key": "cachingEnabled",
            "$": "false"
          }
        },
        "store": {
          "@class": "dataStore",
          "name": `${this.workspaceName}:${this.storeName}`,
          "href": `${GEOSERVER_URL}geoserver/rest/workspaces/${this.workspaceName}/datastores/${this.storeName}.json`
        },
        "serviceConfiguration": false,
        "maxFeatures": 0,
        "numDecimals": 0,
        "padWithZeros": false,
        "forcedDecimal": false,
        "overridingServiceSRS": false,
        "skipNumberMatched": false,
        "circularArcPresent": false,
        "attributes": {
          "attribute": [
            {
              "name": "geom",
              "minOccurs": 0,
              "maxOccurs": 1,
              "nillable": true,
              "binding": "org.locationtech.jts.geom.Polygon"
            },
            {
              "name": "cat",
              "minOccurs": 0,
              "maxOccurs": 1,
              "nillable": true,
              "binding": "java.lang.Integer"
            }
          ]
        }
      }
    }
  }

  post() {
    return geoServer.post(
      `/rest/workspaces/${this.workspaceName}/datastores/${this.storeName}/featuretypes`,
      this.getBody()
    )
  }
}

module.exports = {
  /**
   * add a datastore (a map data source) through Geoserver REST API
   * @param {String} workspaceName
   * @param {String} storeName
   * @param {String} databaseFile
   */
  async addDatastore(workspaceName, storeName, databaseFile, databaseFileFormat) {
    const ds = new DataStore(workspaceName, storeName, databaseFile, databaseFileFormat)
    const res = await ds.post().catch(errorHandler)
    return res.data
  },

  /**
   * remove a datastore and the layers dependant on it through Geoserver REST API
   * @param {*} workspaceName 
   * @param {*} storeName 
   */
  removeDatastore(workspaceName, storeName) {
    return geoServer.delete(
      `/rest/workspaces/${workspaceName}/datastores/${storeName}`,
      {
        params: { recurse: true },
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json'
        }
      }
    ).catch(errorHandler)
  },

  /**
   * add and publish a featureType (map layer) through Geoserver REST API
   * @param {String} workspaceName
   * @param {String} storeName
   * @param {String} featureTypeName
   */
  async addFeatureType(workspaceName, storeName, featuretypeName) {
    const ft = new FeatureType(workspaceName, storeName, featuretypeName)
    const res = await ft.post().catch(errorHandler)
    return res.data
  },
}

/**
 * Error handler for axios calls
 * @param {Object} err 
 */
function errorHandler(err) {
  if (err.response) {
    throw new Error(`
    Geoserver API invalid response;
    response.data - ${err.response.data};
    response.status - ${err.response.status};
    response.header - ${JSON.stringify(err.response.headers)}
    `);
  } else if (err.request) {
    throw new Error(`
    \n
    Geoserver API request failed;
    request - ${JSON.stringify(err.request)}
    `);
  } else {
    throw new Error(`
    \n
    Geoserver API request failed;
    request - ${JSON.stringify(err.message)}
    `);
  }
}