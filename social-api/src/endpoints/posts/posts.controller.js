const init = ({ postsService }) => {
  return {
    posts_upload: async (req, res, next) => {
      const { title, body, summary, communityId } = req.body
      const authorId = req.user

      try {
        await postsService.uploadPost({ authorId, title, body, summary, communityId })
        return res.send({ success: true, message: `Successfully created new post!`})
      } catch (error) {
        console.log(`Posts Upload Error: ${error}`)
      }
    }
  }
}

module.exports = { init }