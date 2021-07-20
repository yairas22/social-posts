const db = require('../../src/db')
const users = require('../../src/users')

describe('DB Migration', () => {
  before(async done => {
    await db.initDB()
    done()
  })

  describe('Initialize all MySQL table schemas', () => {
    it('Drop and create database', async done => {
      await db.mysqlExecute('DROP DATABASE IF EXISTS feeds', [])
      await db.mysqlExecute('CREATE DATABASE feeds', [])
      await db.mysqlExecute('USE feeds', [])
      done()
    })

    it('Creates roles table', async done => {
      await db.mysqlExecute(`
        CREATE TABLE roles (
          id int(10) unsigned NOT NULL AUTO_INCREMENT,
          name varchar(100) NOT NULL,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `)
      await db.mysqlExecute(`INSERT INTO roles (id, name) VALUES (1, 'REGULAR'), (2, 'MODERATOR'), (3, 'SUPER MODERATOR')`)
      done()
    })

    it('Creates countries table', async done => {
      await db.mysqlExecute(`
        CREATE TABLE countries (
          id int(10) unsigned NOT NULL AUTO_INCREMENT,
          name varchar(100) NOT NULL,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `)

      await db.mysqlExecute(`INSERT INTO countries (id, name) VALUES (1, 'Israel'), (2, 'Moldova'), (3, 'France'), (4, 'Italy')`)
      done()
    })

    it('Creates users table', async done => {
      await db.mysqlExecute(`
        CREATE TABLE users ( 
            id int(10) unsigned NOT NULL AUTO_INCREMENT,
            created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            role_id int(2) NOT NULL DEFAULT '1',
            email varchar(150) NOT NULL,
            imageUrl varchar(255) NOT NULL,
            country_id int(4) NOT NULL,
            PRIMARY KEY (id),
            INDEX (role_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`)
      await db.addTestUser(users.tom)
      await db.addTestUser(users.alice)
      await db.addTestUser(users.bob)
      await db.addTestUser(users.moti)
      done()
    })

    it('Creates communities table with data', async done => {
      await db.mysqlExecute(`
        CREATE TABLE communities (
            id int(10) unsigned NOT NULL AUTO_INCREMENT,
            title varchar(255) NOT NULL,
            imageUrl varchar(255) NOT NULL,
            created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`)
      await db.mysqlExecute(`
        INSERT INTO communities (id, title, imageUrl) VALUES 
          (1, 'My First Community', 'fgroup.png'),
          (2, 'Happy Community', 'aws_group.png'),
          (3, 'Dating Community', 'dating_group.png'),
          (4, 'Devs Community', 'dev_group.png')
        `
      )
      done()
    })

    it('Creates user_communities table and attach users to communities', async done => {
      await db.mysqlExecute(`
        CREATE TABLE user_communities (
            user_id int(10) unsigned NOT NULL,
            community_id int(10) unsigned NOT NULL,
            PRIMARY KEY (user_id, community_id),
            FOREIGN KEY (user_id) 
            REFERENCES users (id)
            ON DELETE CASCADE
            ON UPDATE NO ACTION
        ) ENGINE=InnoDB AUTO_INCREMENT=1`)

      await db.mysqlExecute(`
          INSERT INTO user_communities (user_id, community_id) VALUES
            (1, 1), (1, 2), (1, 3), (2, 1), (2, 3), (3, 1), (3, 2)
      `)
      done()
    })

    it('Creates posts table', async done => {
      await db.mysqlExecute(`
        CREATE TABLE posts (
            id int(10) unsigned NOT NULL AUTO_INCREMENT,
            author_id int(10) unsigned NOT NULL,
            community_id int(10) unsigned NOT NULL,
            title text NOT NULL,
            summary text DEFAULT NULL,
            body text DEFAULT NULL,
            status ENUM('PENDING', 'APPROVED') NULL DEFAULT 'PENDING',
            created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            INDEX (community_id),
            FOREIGN KEY (author_id) 
            REFERENCES users (id)
            ON DELETE CASCADE
            ON UPDATE NO ACTION,
            FOREIGN KEY (community_id)
            REFERENCES communities (id)
            ON DELETE CASCADE
            ON UPDATE NO ACTION
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8`)
      done()
    })

    it('Creates posts_likes table', async done => {
      await db.mysqlExecute(`
        CREATE TABLE posts_likes (
          user_id int(10) unsigned NOT NULL,
          post_id int(10) unsigned NOT NULL,
          UNIQUE (user_id, post_id),
          FOREIGN KEY (user_id) 
          REFERENCES users (id)
          ON DELETE CASCADE
          ON UPDATE NO ACTION,
          FOREIGN KEY (post_id) 
          REFERENCES posts (id)
          ON DELETE CASCADE
          ON UPDATE NO ACTION)
        `)
      done()
    })
  })
})
