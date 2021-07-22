const init = ({ postsService }) => {
  return {
    posts_upload: async (req, res, next) => {
      const { title, body, summary, communityId } = req.body
      const authorId = req.user

      try {
        const isAllowedToPost = await postsService.isAllowedToPost(authorId, communityId)
        if (!isAllowedToPost) {
          return res.status(403).send({ success: false, message: `Not allowed to post` })
        }
        await postsService.uploadPost({ authorId, title, body, summary, communityId })
        return res.send({ success: true, message: `Successfully created new post!`})
      } catch (error) {
        console.log(`Posts Upload Error: ${error}`)
        next()
      }
    }
  }
}

module.exports = { init }
