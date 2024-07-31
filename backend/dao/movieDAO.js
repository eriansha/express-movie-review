// Data access object (DAO)

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
    filter = null,
    page = 0,
    moviewPerPage = 20
  } = {}) {
    let query

    if (filter) {
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
        .limit(moviewPerPage)
        .skip(moviewPerPage * page)

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
}
