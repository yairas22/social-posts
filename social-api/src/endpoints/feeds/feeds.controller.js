const init = ({ feedsService }) => {
  return {
    feeds_getRelevance: async (req, res, next) => {
      const userId = req.user
      try {
        const feeds = await feedsService.getRelevanceFeeds(userId)
        return res.send({ success: true, feeds })
      } catch (error) {
        console.log(`Feeds Relevance Error: ${error}`)
        next()
      }
    }
  }
}

module.exports = { init }
