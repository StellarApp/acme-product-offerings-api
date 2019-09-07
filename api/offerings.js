const app = require('express').Router()
const db = require('../db')
const { Offering } = db.models

app.get('/', async (req, res, next) => {
    try {
        res.send(await Offering.findAll())
    } catch (e) {
        next(e)
    }
})

module.exports = app

