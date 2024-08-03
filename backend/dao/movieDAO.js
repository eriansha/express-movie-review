// Data access object (DAO)

import mongodb from 'mongodb'

const ObjectId = mongodb.ObjectId
let movies

export default class MoviewDAO {
  static async injectDB(conn) {
    if (movies) {
      return
    }

    try {
      movies = await conn.db(process.env.MOVIEREVIEWS_NS)
        .collection('movies')
    } catch (e) {
      console.error(`unable to connect in MovieDAO: ${e}`)
    }
  }

  static async getMoviews({
    filters = null,
    page = 0,
    moviesPerPage = 20
  } = {}) {
    let query

    if (filters) {
      // Similar to filters.hasOwnProperty('title')
      if ("title" in filters) {
        /**
         * using $text query and $search operatos to search for moview titles containing the user-specified search terms.
         * Additionally, the $text query allows us to query using multiple words by separating words with spaces
         */
        query = { $text: { $search: filters['title']}}
      } else if("rated" in filters) {
        /**
         * using $eq operator to find specified value on the database
         */
        query = { "rated": { $eq: filters['rated']}}
      }
    }

    let cursor
    try {
      cursor = await movies.find(query)
        .limit(moviesPerPage)
        .skip(moviesPerPage * page)

      const moviesList = await cursor.toArray()
      const totalNumMovies = await movies.countDocuments(query)
      return {
        moviesList,
        totalNumMovies
      }
    } catch(e) {
      console.error(`Unable to issue find command: ${e}`)
      return {
        moviesList: [],
        totalNumMovies: 0
      }
    }
  }

  static async getMovieById(id) {
    try {
      return await movies.aggregate([
        {
          $match: {
            _id: new ObjectId(id),
          }
        },
        {
          $lookup: {
            from: 'reviews',
            localField: '_id',
            foreignField: 'movie_id',
            as: 'reviews',
          }
        }
      ]).next()
    } catch (e) {
      console.error(`something went wrong in getMovieById: ${e}`)
      throw e
    }
  }

  static async getRatings() {
    let ratings = []
    try {
      ratings = await movies.distinct("rated")
      return ratings
    } catch (e) {
      console.error(`unable to get ratings, ${e}`)
      return ratings
    }
  }
}
