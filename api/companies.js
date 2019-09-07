const app = require('express').Router()
const db = require('../db')
const { Company } = db.models

app.get('/', async (req, res, next) => {
    try {
        res.send(await Company.findAll())
    } catch (e) {
        next(e)
    }
})

module.exports = app
