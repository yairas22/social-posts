class UsersModels {
  constructor(mysql) {
    this.mysql = mysql
  }

  async getUsersEmailsByRoles (roles) {
    const users = await this.mysql.execute(`
        SELECT email
        FROM users
        WHERE role_id IN (SELECT id FROM roles WHERE name IN (?))
        `,
        [ roles ]
    )

    return users.map(user => user.email)
  }
}

module.exports = UsersModels

