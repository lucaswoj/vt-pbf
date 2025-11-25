import fs from 'fs'
import path from 'path'
import geojsonVt from 'geojson-vt'
import Pbf from 'pbf'
import { VectorTile } from '@mapbox/vector-tile'
import Benchmark from 'benchmark'
import * as serialize from '../index'

import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

var raw = fs.readFileSync(path.join(__dirname, '../test/fixtures/rectangle-1.0.0.pbf'))
var rawTile = new VectorTile(new Pbf(raw))
serialize.fromVectorTileJs(rawTile)

var properties = JSON.parse(fs.readFileSync(path.join(__dirname, 'properties.geojson')))
var propertiesTile = geojsonVt(properties).getTile(0, 0, 0)

var simple = JSON.parse(fs.readFileSync(path.join(__dirname, 'rectangle.geojson')))
var simpleTile = geojsonVt(simple).getTile(0, 0, 0)

var points = JSON.parse(fs.readFileSync(path.join(__dirname, 'points.geojson')))
var pointsTile = geojsonVt(points).getTile(14, 3888, 6255)

var suite = new Benchmark.Suite('vt-pbf')
suite
  .add('raw', function () {
    serialize.fromVectorTileJs(rawTile)
  })
  .add('simple', function () {
    serialize.fromGeojsonVt({ 'geojsonLayer': simpleTile })
  })
  .add('points', function () {
    serialize.fromGeojsonVt({ 'geojsonLayer': pointsTile })
  })
  .add('lots of properties', function () {
    serialize.fromGeojsonVt({ 'geojsonLayer': propertiesTile })
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .run()
