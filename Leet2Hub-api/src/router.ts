import { Router } from 'express'
import NodeCache from 'node-cache'

import {
  fetchDailyProblem,
  fetchProfileData,
  fetchUserProfileCalendar,
} from './leetcode.api'

const router = Router()

// Initialize cache
// stdTTL is the default time-to-live in seconds
const cache = new NodeCache({ stdTTL: 300 }) // 5 minutes default

router.get('/', async (_, res) => {
  return res.status(200).json({
    message: 'Welcome to Leet2Hub API',
    totalSolvedProblems: '/api/v2/:userId',
    dailyProblem: '/api/v2/daily',
    last20Submissions: '/api/v2/submissions/:userId',
    profileCalendar: '/api/v2/userProfileCalendar/:username',
  })
})

/**
 * GET /api/v2/daily
 * Fetches the daily problem from LeetCode.
 * Caches the response for 1 hour.
 * @returns {Promise<DailyProblem>} - The daily problem.
 **/
router.get('/daily', async (_, res) => {
  const cacheKey = 'daily_problem'
  const cachedData = cache.get(cacheKey)

  if (cachedData) {
    return res.status(200).json({ data: cachedData })
  }

  try {
    const data = await fetchDailyProblem()
    if (!data) {
      return res.status(500).json({ error: 'Failed to fetch daily problem' })
    }

    cache.set(cacheKey, data, 3600) // Cache for 1 hour (3600 seconds)
    return res.status(200).json({ data })
  } catch (e) {
    console.error('Error fetching daily problem:', e)
    return res.status(500).json({ error: 'An error occurred while fetching daily problem data' })
  }
})

/**
 * GET /api/v2/:userId
 * Fetches the user's profile data from LeetCode.
 * Caches the response for 5 minutes.
 * @param {string} userId - The user's LeetCode user ID.
 * @returns {Promise<ProfileData>} - The user's profile data.
 **/
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId
  const cacheKey = `profile_${userId}`
  const cachedData = cache.get(cacheKey)

  if (cachedData) {
    return res.status(200).json({ data: cachedData })
  }

  try {
    const data = await fetchProfileData(userId)
    if (!data) return res.status(404).json({ error: 'User not found' })

    cache.set(cacheKey, data) // Uses default 5 minute TTL
    return res.status(200).json({ data })
  } catch (e) {
    console.error('Error fetching user profile data:', e)
    return res.status(500).json({ error: 'An error occurred while fetching user profile data' })
  }
})

/**
 * GET /api/v2/userProfileCalendar/:username
 * Fetches the user's profile calendar from LeetCode.
 * Caches the response for 5 minutes.
 * @param {string} username - The user's LeetCode username.
 * @returns {Promise<ProfileCalendar>} - The user's profile calendar.
 **/
router.get('/userProfileCalendar/:username', async (req, res) => {
  const { username } = req.params
  const cacheKey = `calendar_${username}`
  const cachedData = cache.get(cacheKey)

  if (cachedData) {
    return res.status(200).json(cachedData)
  }

  try {
    const userCalendar = await fetchUserProfileCalendar(username)
    if (!userCalendar) return res.status(404).json({ error: 'User not found' })

    cache.set(cacheKey, userCalendar) // Uses default 5 minute TTL
    res.json(userCalendar)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router
