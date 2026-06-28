import app from './server'

const PORT = process.env.PORT || 3000

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Listening locally on http://localhost:${PORT}`)
  })
}

export default app
