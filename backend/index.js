import app from './server.js'
import mongodb from "mongodb"
import dotenv from "dotenv"
import MoviesDAO from './dao/movieDAO.js'
import ReviewsDAO from './dao/ReviewsDAO.js'

async function main() {
  dotenv.config()
  const client = new mongodb.MongoClient(
    process.env.MOVIEREVIEWS_DB_URI
  )

  const port = process.env.port || 8000

  try {
    // connect to MongoDB cluster
    await client.connect()

    // injecting connecting string to get access to movie collecitons
    await MoviesDAO.injectDB(client)
    await ReviewsDAO.injectDB(client)

    app.listen(port, () => {
      console.log('Server is running on port: ' + port)
    })
  } catch (e) {
    console.log(e)
    process.exit()
  }
}

main().catch(console.error)
