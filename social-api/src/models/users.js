function usersModel (mysqlClient) {
  async function getUserData (userId) {
    const user = await mysqlClient.execute(`
        SELECT id, role_id, email, imageUrl, country_id AS country 
        FROM users 
        WHERE id = ?
        `,
        [ userId ]
    )

    return user[0]
  }

  async function getUserCommunities (userId) {
    const communities = await mysqlClient.execute(`
        SELECT community_id AS id
        FROM user_communities
        WHERE user_id = ?
        `,
        [ userId ]
    )

    return communities.map(community => community.id)
  }

  return { getUserData, getUserCommunities }
}

module.exports = usersModel
