const express = require('express')
const app = express()
const path = require('path')
const db = require('./db')

const logger = (req, res, next) => {
    console.log(`Received ${req.method} request on ${req.url}`)
    next()
}
app.use(logger)

/* routes */
app.use('/api/products', require('./api/products'))
app.use('/api/companies', require('./api/companies'))
app.use('/api/offerings', require('./api/offerings'))

/* serve UI */
app.get('/', (req, res, next) => {
    try {
        res.sendFile(path.join(__dirname, 'index.html'))
    } catch (e) {
        next(e)
    }
})

/* initiate db connection */
db.sync()
    .then(() => {
        const port = process.env.PORT || 3000
        app.listen(port, () => console.log('Listening on port', port))
    })
    .catch(ex => console.log('Error:', ex))
