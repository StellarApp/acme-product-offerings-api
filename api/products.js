const app = require('express').Router()
const db = require('../db')
const { Product } = db.models

app.get('/', async (req, res, next) => {
    try {
        res.send(await Product.findAll())
    } catch (e) {
        next(e)
    }
})

module.exports = app
