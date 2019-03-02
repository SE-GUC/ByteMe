

const express = require('express')
const mongoose = require('mongoose')

// Require Router Handlers
const users = require('./routes/api/users')
const events = require('./routes/api/events')
const mailinglist = require('./routes/api/mailing_list')
const faq = require('./routes/api/faq')
const pages = require('./routes/api/page')
const library = require('./routes/api/library')
const announcements = require('./routes/api/announcements')
const clubs = require('./routes/api/clubs')
const product = require('./routes/api/products')



const app = express()

// DB Config
const db = require('./config/keys').mongoURI

// Connect to mongo
mongoose
    .connect(db)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err))

// Init middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


// Entry point

app.get('/', (req, res) => res.send(`<h1>Welcome to Our Platform</h1> 
<h2><a href="/api/page">Councils/Offices/Commitees</a> 
<br> <a href="/api/mailing_list">Mailing list</a> 
<br> <a href="/api/faq">FAQs</a> 
<br> <a href="/api/announcements">Announcements</a> 
<br> <a href="/api/library">Library</a> </h2>`))



// Direct to Route Handlers
app.use('/api/events', events)
app.use('/api/users', users)
app.use('/api/page', pages)
app.use('/api/mailing_list', mailinglist)
app.use('/api/faq', faq)
app.use('/api/library', library)
app.use('/api/announcements', announcements)
app.use('/api/clubs', clubs)
app.use('/api/products', product)


app.use((req, res) => res.status(404).send(`<h1>Can not find what you're looking for</h1>`))

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Server on ${port}`))