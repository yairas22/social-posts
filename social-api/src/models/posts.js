function postsModel (mysqlClient) {
  async function insertNewPost ({ title, summary, authorId, communityId, body }) {
    return await mysqlClient.execute(
      `INSERT INTO posts (title, summary, author_id, community_id, body)
        VALUES (?, ?, ?, ?, ?);
      `,
      [ title, summary, authorId, communityId, body ]
    )
  }

  async function getByRelatedCommunities (communities, country, userId, limit = 100) {
    const sameCountry = await mysqlClient.execute(
      queryCountry(true),
      [ communities, country, userId, Math.ceil(limit/2) ]
    )

    const differentCountry = await mysqlClient.execute(
      queryCountry(false),
      [ communities, country, userId, Math.ceil(limit/2) ]
    )

    return [...sameCountry, ...differentCountry]
  }

  return { insertNewPost, getByRelatedCommunities }
}

function queryCountry (equal = false) {
  return `SELECT posts.id, title, summary, author_id, community_id, body, countries.name AS country,
            COUNT(posts_likes.post_id) AS likes,
            (COUNT(posts_likes.post_id) * 0.8 + LENGTH(posts.body) * 0.2) AS weightScore
          FROM posts 
          LEFT JOIN posts_likes ON posts.id = posts_likes.post_id
          INNER JOIN users ON posts.author_id = users.id
          INNER JOIN countries ON users.country_id = countries.id
          WHERE community_id IN (?) AND users.country_id ${equal ? '=': '<>'} ?
          AND status = 'APPROVED' AND users.id <> ?
          GROUP BY posts.id
          ORDER BY weightScore DESC
          LIMIT ?`
}

module.exports = postsModel
