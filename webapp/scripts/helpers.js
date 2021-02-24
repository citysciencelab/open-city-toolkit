const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process') // Documentation: https://nodejs.org/api/child_process.html

const OUTPUT_DIR = process.env.OUTPUT_DIR
const GEOSERVER_UPLOAD = `${process.env.GEOSERVER_DATA_DIR}/data/upload/`

/**
 * Check if directory is writable
 * @param {string} path path to the directory
 */
function checkWritableDir(path) {
  try {
    fs.accessSync(path, fs.constants.W_OK)
  } catch (err) {
    throw new Error(`Cannot launch module: ${path} is not writable.`)
  }
}

/**
 * Function to filter default layers (basemap, selection, etc.)
 */
function filterDefaultLayers(map) {
  return !map.match(/^((lines|points|polygons|relations)(_osm)?|selection|location_bbox)(@.+)?$/)
}

/**
 * Function to filter filenames default layers (basemap, selection, etc.)
 */
function filterDefaultLayerFilenames(map) {
  return !map.match(/^(.*\/)?((lines|points|polygons|relations)(_osm)?|selection|location_bbox).gpkg$/)
}

/**
 * Merge multiple PDF files into one
 * @param {string} outfile output file
 * @param {...string} infiles input files
 */
function mergePDFs(outfile, ...infiles) {
  infiles = infiles.map(file => `"${file}"`).join(" ")
  execSync(`gs -dBATCH -dNOPAUSE -q -sDEVICE=pdfwrite -dPDFSETTINGS=/prepress -sOutputFile="${outfile}" ${infiles}`)
}

/**
 * Convert PS to PDF
 * @param {string} infile input file
 * @param {string} outfile output file
 */
function psToPDF(infile, outfile) {
  execSync(`ps2pdf ${infile} ${outfile}`)
}

/**
 * Convert text to PS
 * @param {string} infile input file
 * @param {string} outfile output file
 */
function textToPS(infile, outfile) {
  execSync(`cat ${infile} | iconv -c -f utf-8 -t ISO-8859-1 | enscript -p ${outfile}`)
}

/**
 * Prints all the result files in the 'output' folder
 * @returns {string[]} list of result filenames
 */
function getResults() {
  return fs.readdirSync(OUTPUT_DIR).filter(file => file.match(/\.pdf$/i))
}

/**
 * returns all user-uploaded layers in GEOSERVER_DATA_DIR
 * @returns {array} list of user-uploaded layers
 */
function getUploadLayers() {
  return getFilesOfType('gpkg', GEOSERVER_UPLOAD)
    .map(name => name.substring(name.lastIndexOf('/') + 1, name.lastIndexOf('.')))
}

/**
 * Get all files of a given file type in a directory (recursive)
 * @param {string} extension file extension
 * @param {string} dir directory to search in
 * @returns {string[]} array of filenames
 */
function getFilesOfType(extension, dir, files = []) {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file)
    if (fs.statSync(filePath).isDirectory()) {
      files = getFilesOfType(extension, filePath, files)
    } else if (file.slice(file.lastIndexOf('.') + 1) === extension) {
      files.push(path.join(filePath))
    }
  })
  return files
}

module.exports = {
  checkWritableDir,
  filterDefaultLayers,
  filterDefaultLayerFilenames,
  getFilesOfType,
  getResults,
  getUploadLayers,
  mergePDFs,
  psToPDF,
  textToPS
}
