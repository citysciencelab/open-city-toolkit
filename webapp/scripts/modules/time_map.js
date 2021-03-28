const fs = require('fs')
const { addVector, getValueSetsVector, gpkgOut, grass, initMapset, listVector, mapsetExists, remove } = require('../grass')
const { checkWritableDir, mergePDFs, psToPDF, textToPS } = require('../helpers')
const translations = require(`../../i18n/messages.${process.env.USE_LANG || 'en'}.json`)

const GEOSERVER = `${process.env.GEOSERVER_DATA_DIR}/data`
const GRASS = process.env.GRASS_DIR
const OUTPUT = process.env.OUTPUT_DIR

const AVERAGE_SPEED = 40
const ROAD_POINTS = 0.003
const CONNECT_DISTANCE = 0.003
const CONVERSION_RESOLUTION = 0.0001
const METER_TO_PROJ = 111320 // length of a degree of latitude, or of a degree of longitude at the equator, in meters

module.exports = class {
  constructor() {
    this.mapset = 'time_map'
  }

  launch() {
    checkWritableDir(GEOSERVER)
    checkWritableDir(OUTPUT)

    if (!mapsetExists('PERMANENT')) {
      return { id: 'time_map.7', message: translations['time_map.message.7'] }
    }

    initMapset(this.mapset)

    if (listVector('PERMANENT').indexOf('selection@PERMANENT') < 0) {
      return { id: 'time_map.11', message: translations['time_map.message.11'] }
    }

    // Read resolution from file if it exists
    try {
      this.resolution = parseFloat(fs.readFileSync(`${GRASS}/variables/resolution`).toString().trim().split('\n')[1])
    } catch (err) {
      return { id: 'time_map.10', message: translations['time_map.message.10'] }
    }

    // Copy selection and (basemap) lines from PERMANENT mapset
    grass(this.mapset, `g.copy vector=selection@PERMANENT,selection --overwrite`)
    grass(this.mapset, `g.copy vector=lines@PERMANENT,lines --overwrite`)

    // Read road speed values from file if it exists - otherwise use defaults
    if (!fs.existsSync(`${GRASS}/variables/roads_speed_automobile`)) {
      fs.copyFileSync(`${GRASS}/variables/defaults/roads_speed_automobile_defaults`, `${GRASS}/variables/roads_speed_automobile`)
    }
    if (!fs.existsSync(`${GRASS}/variables/roads_speed_walking`)) {
      fs.copyFileSync(`${GRASS}/variables/defaults/roads_speed_walking_defaults`, `${GRASS}/variables/roads_speed_walking`)
    }
    if (!fs.existsSync(`${GRASS}/variables/roads_speed_bicycle`)) {
      fs.copyFileSync(`${GRASS}/variables/defaults/roads_speed_bicycle_defaults`, `${GRASS}/variables/roads_speed_bicycle`)
    }

    this.highwayTypes = fs.readFileSync(`${GRASS}/variables/defaults/highway_types`).toString().trim().split('\n')

    this.averageSpeed = AVERAGE_SPEED

    // Delete files from previous run, if any
    for (const filename of ['m1_from_points.gpkg', 'm1_stricken_area.gpkg', 'm1_time_map.gpkg', 'm1_time_map.tif']) {
      try {
        fs.unlinkSync(`${GEOSERVER}/${filename}`)
      } catch (err) {
        // nothing to unlink
      }
    }

    // remove GRASS layers from previous run, if any
    try {
      remove(this.mapset, 'm1_from_points')
      remove(this.mapset, 'm1_stricken_area')
    } catch (err) {
      // nothing to unlink
    }

    return { id: 'time_map.0', message: translations['time_map.message.0'] }
  }

  process(message, replyTo) {
    switch (replyTo) {
      case 'time_map.0': {
        this.travelMode = message.toLowerCase();

        let speedFile = ''
        switch (message) {
          case 'Automobile':
            speedFile = 'roads_speed_automobile'
            break
          case 'Bicycle':
            speedFile = 'roads_speed_bicycle'
            break
          case 'Walking':
            speedFile = 'roads_speed_walking'
            break
        }
        this.roadsSpeed = fs.readFileSync(`${GRASS}/variables/${speedFile}`).toString().trim().split('\n')
        this.roadSpeedValues = new Map(this.highwayTypes.map((t, i) => [t, parseFloat(this.roadsSpeed[i].split(':')[1])]))

        return { id: 'time_map.1', message: translations['time_map.message.1'] }
      }
      case 'time_map.1':
        if (message.match(/drawing\.geojson/)) {
          addVector(this.mapset, message, 'm1_from_points')
          gpkgOut(this.mapset, 'm1_from_points', 'm1_from_points')
          this.fromPoints = 'm1_from_points'
          return { id: 'time_map.3', message: translations['time_map.message.3'] }
        }
        return { id: 'time_map.5', message: translations['time_map.message.5'] }

      case 'time_map.3':
        if (message.match(/drawing\.geojson/)) {
          this.strickenArea = 'm1_stricken_area'
          addVector(this.mapset, message, this.strickenArea)
          gpkgOut(this.mapset, this.strickenArea, this.strickenArea)
          return { id: 'time_map.4', message: translations['time_map.message.4'] }
        } else if (message === 'risk_zone') {
          this.strickenArea = 'm1_stricken_area'
          return {
            id: 'time_map.12',
            message: translations['time_map.message.12'],
            list: listVector('cotopaxi_scenarios').filter(layer => layer.match(/^(ash_fall|lahar_flow|lava_flow)_zones@cotopaxi_scenarios$/))
          }
        }
        this.strickenArea = null;
        this.calculate()
        return {
          id: 'time_map.6',
          message: translations['time_map.message.6'],
          result: this.outfile
        }

      case 'time_map.12':
        this.zonesLayer = message
        return {
          id: 'time_map.13',
          message: translations['time_map.message.13'],
          list: getValueSetsVector(this.mapset, this.zonesLayer)
        }

      case 'time_map.13': {
        // Extract matching features and store them in queryZone
        const [col, val] = message
        console.log(col, val)
        grass(this.mapset, `v.extract input=${this.zonesLayer} where="${col} = '${val}'" output=${this.strickenArea} --overwrite`)
        gpkgOut(this.mapset, this.strickenArea, this.strickenArea)
        return { id: 'time_map.4', message: translations['time_map.message.4'] }
      }

      case 'time_map.4':
        this.reductionRatio = parseFloat(message) / 100
        this.calculate()
        return {
          id: 'time_map.6',
          message: translations['time_map.message.6'],
          result: this.outfile
        }
    }
  }

  calculate() {
    this.outfile = null;

    // Setting region to fit the "selection" map (taken by location_selector) and resolution
    grass(this.mapset, `g.region vector=selection@PERMANENT res=${this.resolution} --overwrite`)

    // "TO" points has a default value, the points of the road network will used for. But, because these points are on the road by its origin, therefore no further connecting is requested.
    grass(this.mapset, `v.to.points input=highways@PERMANENT output=m1a_highway_points dmax=${ROAD_POINTS} --overwrite`)
    this.toPoints = 'm1a_highway_points'

    // threshold to connect is ~ 330 m
    grass(this.mapset, `v.net input=highways points=${this.fromPoints} output=m1a_highways_points_connected operation=connect threshold=${CONNECT_DISTANCE} --overwrite`)

    // Add "spd_average" attribute column (integer type) to the road network map (if not yet exist -- if exist GRASS will skip this process)
    grass(this.mapset, `v.db.addcolumn map=m1a_highways_points_connected columns='avg_speed double precision'`)

    // Now updating the datatable of highways_points_connected map, using "roads_speed" file to get speed data and conditions.
    for (const [where, value] of this.roadSpeedValues) {
      grass(this.mapset, `v.db.update map=m1a_highways_points_connected layer=1 column=avg_speed value=${value} where="${where.replace(/"/g, '\\"')}"`)
    }

    // Converting clipped and connected road network map into raster format and float number
    grass(this.mapset, `v.extract -r input=m1a_highways_points_connected@${this.mapset} where="avg_speed>=0" output=m1a_temp_connections --overwrite`)
    grass(this.mapset, `v.to.rast input=m1a_temp_connections output=m1a_temp_connections use=val value=${this.averageSpeed} --overwrite`)
    grass(this.mapset, `v.to.rast input=m1a_highways_points_connected output=m1a_highways_points_connected_1 use=attr attribute_column=avg_speed --overwrite`)
    grass(this.mapset, `r.patch input=m1a_temp_connections,m1a_highways_points_connected_1 output=m1a_highways_points_connected --overwrite`)
    grass(this.mapset, `r.mapcalc expression="m1a_highways_points_connected=float(m1a_highways_points_connected)" --overwrite`)

    grass(this.mapset, `v.buffer input=${this.fromPoints} output=m1a_from_via_zones distance=${this.resolution} --overwrite`)
    grass(this.mapset, `v.to.rast input=m1a_from_via_zones output=m1a_from_via_zones use=val val=${this.averageSpeed} --overwrite`)
    grass(this.mapset, `r.patch input=m1a_highways_points_connected,m1a_from_via_zones output=m1a_highways_points_connected_zones --overwrite`)

    // Now the Supplementary lines (formerly CAT_SUPP_LINES) raster map have to be added to map highways_from_points. First I convert highways_points_connected into raster setting value to 0(zero). Resultant map: temp. After I patch temp and highways_points_connected, result is:highways_points_connected_temp. Now have to reclass highways_points_connected_temp, setting 0 values to the speed value of residentals
    grass(this.mapset, `v.to.rast input=m1a_highways_points_connected output=m1a_temp use=val val=${this.averageSpeed} --overwrite`)
    grass(this.mapset, `r.patch input=m1a_highways_points_connected_zones,m1a_temp output=m1a_highways_points_connected_temp --overwrite`)

    if (this.strickenArea) {
      grass(this.mapset, `v.to.rast input=${this.strickenArea} output=${this.strickenArea} use=val value=${this.reductionRatio} --overwrite`)
      grass(this.mapset, `r.null map=${this.strickenArea} null=1 --overwrite`)
      grass(this.mapset, `r.mapcalc expression="m1a_highways_points_connected_area_temp=(m1a_highways_points_connected_temp*${this.strickenArea})" --overwrite`)
    } else {
      grass(this.mapset, `g.rename raster=m1a_highways_points_connected_temp,m1a_highways_points_connected_area_temp --overwrite`)
    }
    grass(this.mapset, `r.mapcalc expression="m1a_highways_points_connected_area=(m1a_highways_points_connected_area_temp*1)" --overwrite`)

    // specific_time here is the time requested to cross a cell, where the resolution is as defined in resolution file
    grass(this.mapset, `r.mapcalc expression="m1a_specific_time=${this.resolution}/(m1a_highways_points_connected_area*0.27777)" --overwrite`)

    grass(this.mapset, `r.cost input=m1a_specific_time output=m1a_from_to_cost start_points=${this.fromPoints} stop_points=${this.toPoints} --overwrite`)
    grass(this.mapset, `r.mapcalc expression="m1a_time_map=m1a_from_to_cost*${METER_TO_PROJ}/60" --overwrite`)

    // export raster map
    grass(this.mapset, `r.out.gdal input=m1a_time_map output="${GEOSERVER}/m1_time_map.tif" format=GTiff --overwrite`)

    if (this.strickenArea) {
      grass(this.mapset, `v.type input=m1_stricken_area output=m1_stricken_area_lines from_type=boundary to_type=line --overwrite`)
    }

    // Converting the result into vector point format
    grass(this.mapset, `g.region res=${CONVERSION_RESOLUTION}`)
    grass(this.mapset, `r.to.vect input=m1a_time_map output=m1_time_map type=point column=data --overwrite`)
    grass(this.mapset, `v.out.ogr -s input=m1_time_map@${this.mapset} type=point output="${GEOSERVER}/m1_time_map.gpkg" --overwrite`)

    // Generating pdf output

    let psParams = fs.readFileSync(`${GRASS}/variables/defaults/time_map.ps_param`).toString()

    if (this.strickenArea) {
      psParams += `
vlines m1_stricken_area_lines
color #000000
width 0.4
masked n
end
`
    }

    fs.writeFileSync(`${GRASS}/variables/time_map.ps_param`, psParams)

    // set resolution
    grass(this.mapset, `g.region res=${this.resolution}`)

    // Set color
    grass(this.mapset, `r.colors map=m1a_time_map rules="${GRASS}/variables/defaults/time_map_rules_${this.travelMode}"`)

    const date = new Date()
    const dateString = date.toString()
    const safeDateString = date.toISOString().replace(/([\d-]*)T(\d\d):(\d\d):[\d.]*Z/g, '$1_$2$3')

    fs.mkdirSync('tmp', { recursive: true })
    fs.writeFileSync('tmp/time_map_info_text', `
${translations['time_map.output.1']}

${translations['time_map.output.2']}: ${dateString}

${translations['time_map.output.3']}
${translations['time_map.output.4']}

${translations['time_map.output.5']}
${translations['time_map.output.7']}

${translations['time_map.output.8']}:
${this.roadsSpeed.join('\n')}

${translations['time_map.output.9']}: ${this.reductionRatio}`)

    textToPS('tmp/time_map_info_text', 'tmp/time_map_info_text.ps')
    psToPDF('tmp/time_map_info_text.ps', 'tmp/time_map_info_text.pdf')

    grass(this.mapset, `ps.map input="${GRASS}/variables/time_map.ps_param" output=tmp/time_map_1.ps --overwrite`)
    psToPDF('tmp/time_map_1.ps', 'tmp/time_map_1.pdf')

    this.outfile = `time_map_results_${safeDateString}.pdf`

    mergePDFs(`${OUTPUT}/${this.outfile}`, 'tmp/time_map_1.pdf', 'tmp/time_map_info_text.pdf')

    grass(this.mapset, `g.remove -f type=vector pattern=temp_*`)
    grass(this.mapset, `g.remove -f type=vector pattern=m1a_*`)

    fs.rmdirSync('tmp', { recursive: true })
  }
}
