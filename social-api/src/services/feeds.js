function feedsService({ postsModel, usersModel }) {
  async function getRelevanceFeeds(userId) {
    const { country } = await usersModel.getUserData(userId)
    const communities = await usersModel.getUserCommunities(userId)
    return postsModel.getByRelatedCommunities(communities, userId, country)
  }
  
  return { getRelevanceFeeds }
}

module.exports = feedsService
