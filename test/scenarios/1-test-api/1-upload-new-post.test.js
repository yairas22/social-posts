let chai = require('chai')
const db = require('../../src/db')
const expect = chai.expect
const api = require('../../src/api')
const users = require('../../src/users')

describe('Uploading new posts', () => {
  before(async done => {
    await db.initDB()
    await db.mysqlExecute(`DELETE FROM feeds.posts`)
    done()
  })

  it('should successfully upload a new post', async done => {
    const result = await api
      .userRequest(users.alice)
      .post('posts/upload', {
        body: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
        communityId: 1,
        title: 'Lorem Ipsum'
      })

    expect(result.status).equal(200)
    expect(result.data).to.be.a('object')
    expect(result.data.success).equal(true)

    done()
  })

  it('should successfully upload a new post and mail alert to bob and alice the moderators', async done => {
    const result = await api
      .userRequest(users.alice)
      .post('posts/upload', {
        body: `I love to eat ben&jerry`,
        communityId: 1,
        title: 'My favorite ice cream'
      })

    expect(result.status).equal(200)
    expect(result.data).to.be.a('object')
    expect(result.data.success).equal(true)

    done()
  })

  it('should fail to post to a community which does not belong to user', async done => {
    try {
      await api
        .userRequest(users.alice)
        .post('posts/upload', {
          body: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
          communityId: 4,
          title: 'Lorem Ipsum'
        })
        
        done(new Error(`User should not be allowed to post to this community!`))
      } catch ({ response }) {
        expect(response.status).equal(403)
        expect(response.data).to.be.a('object')
        expect(response.data.success).equal(false)
        done()
      }
  })
})
