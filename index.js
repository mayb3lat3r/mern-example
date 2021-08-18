import express from 'express'
import config from 'config'
import mongoose from 'mongoose'
import auth from './routes/auth.routes.js'
import link from './routes/link.routes.js'
import redirect from './routes/redirect.routes.js'


const app = express()
const PORT = process.env.PORT || config.get('PORT')


app.use(express.json({ extended: true }))

app.use('/api/auth', auth)
app.use('/api/link', link)
app.use('/t', redirect)

const start = async () => {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        })
    } catch (e) {
        console.log('Server error', e.message)
        process.exit(1)
    }
}

start()

app.listen(PORT, () => {
    console.log(`Server has been started on port ${PORT} ...`)
})
