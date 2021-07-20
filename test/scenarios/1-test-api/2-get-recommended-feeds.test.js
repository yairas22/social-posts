let chai = require('chai')
const db = require('../../src/db')
const expect = chai.expect
const api = require('../../src/api')
const users = require('../../src/users')

describe('Get Recommended Feeds', () => {
  before(async done => {
    await db.initDB()
    await db.mysqlExecute(`DELETE FROM feeds.posts`)
    await db.mysqlExecute(`DELETE FROM feeds.posts_likes`)

    await db.mysqlExecute(`
      INSERT INTO feeds.posts (id, title, summary, author_id, community_id, body, status) VALUES 
      (1, 'This is my post, should not show', '', 1, 1, 'This should be the last one to show in list', 'APPROVED'),
      (2, 'Same country with no likes', '', 4, 1, 'This author lives at same country as user with no likes, but has long post', 'APPROVED'),
      (3, 'Different country with lots of likes', '', 2, 1, 'I have lots of likes, Im happy', 'APPROVED'),
      (4, 'Same country with lots of likes', '  ', 4, 1, 'I have lots of likes, but short post :(', 'APPROVED'),
      (5, 'Different community', '  ', 4, 4, 'Im in a different community than user', 'APPROVED'),
      (6, 'Different country, no likes', '  ', 3, 1, 'Im in a different community than user', 'APPROVED')
      `)

    await db.mysqlExecute(`
      INSERT INTO feeds.posts_likes (post_id, user_id) VALUES
        (3, 1), (3, 2), (3, 3), (3, 4), (4, 1), (4, 2), (4, 3), (4, 4)
    `)
    done()
  })

  it('should successfully show the recommended feeds', async done => {
    const result = await api
      .userRequest(users.tom)
      .get('feeds')

    expect(result.status).equal(200)
    expect(result.data).to.be.a('object')
    expect(result.data.success).equal(true)
    expect(result.data.feeds).to.be.a('array')
    expect(result.data.feeds[0].id).equal(2)
    expect(result.data.feeds[1].id).equal(4)
    expect(result.data.feeds[2].id).equal(3)
    expect(result.data.feeds[3].id).equal(6)

    done()
  })
})
