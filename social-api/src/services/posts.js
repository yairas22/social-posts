
function postsService ({ postsModel, usersModel, queueService }) {

  async function uploadPost ({ title, summary, authorId, communityId, body }) {
    if (!summary) {
      summary = body.split(' ').slice(0, 100).join(' ')
    }

    await postsModel.insertNewPost({ title, summary, authorId, communityId, body })
    await queueService.addToQueue({ title, summary, authorId, communityId, body })
  }

  async function isAllowedToPost(userId, communityId) {
    const userCommunities = await usersModel.getUserCommunities(userId)
    return userCommunities.some(userCommunityId => userCommunityId === communityId)
  }

  return { uploadPost, isAllowedToPost }
}

module.exports = postsService
