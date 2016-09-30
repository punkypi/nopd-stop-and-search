"use strict"
const express = require('express')

class StopAndSearch {
  static get PORT() {
    return 8080
  }
  static start() {
    const app = express();
    app.use(express.static('.'))
    app.listen(this.PORT)

    console.log('\n Serving directory stop_and_search/ on port ' + this.PORT)
    process.title = 'StopAndSearch'
  }
}

module.exports = StopAndSearch
