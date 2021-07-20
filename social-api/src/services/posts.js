
function postsService ({ postsModel, queueService }) {
  async function uploadPost ({ title, summary, authorId, communityId, body }) {
    if (!summary) {
      summary = body.split(' ').slice(0, 100).join(' ')
    }

    await postsModel.insertNewPost({ title, summary, authorId, communityId, body })
    await queueService.addToQueue({ title, summary, authorId, communityId, body })
  }

  return { uploadPost }
}

module.exports = postsService
