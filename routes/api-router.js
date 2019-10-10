const express = require('express');
const apiRouter = express.Router();
const { treasuresRouter } = require('./treasures-router')

apiRouter.use('/treasures', treasuresRouter)


module.exports = { apiRouter };