import express from 'express'
import MoviesController from './movies.controller.js'
import ReviewsController from './reviews.controller.js'

const router = express.Router()
/** Moview Routes */
router.route('/').get(MoviesController.apiGetMovies)

/** Review Routes */
router.route('/review')
  .post(ReviewsController.apiPostReview)
  .put(ReviewsController.apiUpdateReview)
  .delete(ReviewsController.apiDeleteReview)

export default router
