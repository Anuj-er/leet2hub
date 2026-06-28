import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import router from './router'

dotenv.config()

const app = express()

app.use(cors())
app.options('*', cors())

// Implement rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
})
app.use(limiter)

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (_, res) => {
  res.status(200)
  res.json({
    message: 'Welcome to Leet2Hub API',
    totalSolvedProblems: '/api/v2/:userId',
    dailyProblem: '/api/v2/daily',
    profileCalendar: '/api/v2/userProfileCalendar/:username/',
  })
})

app.use('/api/v2', router)

export default app
