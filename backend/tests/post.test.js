const frisby = require('frisby');
const shell = require('shelljs');
const { Sequelize } = require('sequelize');
const { readFileSync } = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: './../.env' });

const url = `http://${process.env.HOSTNAME}:${process.env.PORT}`;
const sequelize = new Sequelize(
  'wallApp',
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.HOSTNAME,
    dialect: 'mysql',
  },
);

afterAll(async () => {
  await sequelize.query('DROP DATABASE wallApp;', { type: 'RAW' });
  sequelize.close();
});

beforeAll(async () => {
  shell.exec('npx sequelize-cli db:drop');
  shell.exec('npx sequelize-cli db:create && npx sequelize-cli db:migrate $');
});

beforeEach(async () => {
  shell.exec('npx sequelize-cli db:seed:all $');
});


describe('Tests the endpoint `/post`', () => {
  it('It is possible to post e new Post', async () => {
    const challengeQuery = readFileSync(
      './tests/sqlQueryTests/getAllPosts.sql',
      'utf8',
    ).trim();
    const expectedResult = require('./resultsQueryTests/getAllPostsReturn');
    let token;
    await frisby
      .post(`${url}/user/login`, {
        email: 'johndoe@gmail.com',
        user_password: '123456',
      })
      .expect('status', 201)
      .then((response) => {
        const { json } = response;
        expect(json.token).not.toBeNull();
        token = json.token;
      });

    await frisby
      .setup({
        request: {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        },
      })
      .post(`${url}/post`, {
        title: 'The 3thd one',
        content: 'again posting',
      })
      .expect('status', 201)
      .then((response) => {
        const { json } = response;
        expect(json.title).toBe('The 3thd one');
        expect(json.content).toBe('again posting');
        expect(json.userId).toBe(2);
      });

    expect(await sequelize.query(challengeQuery, { type: 'SELECT' })).toEqual(
      expectedResult,
    );
  });

  it('It is possible to get all Posts', async () => {
    const expectedResult = require('./resultsQueryTests/getAllPostsReturn');
    await frisby
      .get(`${url}/post`, {
        title: 'The 3thd one',
        content: 'again posting',
      })
      .expect('status', 200)
      .then((response) => {
        const { body } = response;
        const result = JSON.parse(body);
        expect(result[0].id).toBe(1);
        expect(result[0].title).toBe('First Post');
        expect(result[0].content).toBe('starting posting on the Wall');
        expect(result[0].published).toBe('2021-08-01T19:58:00.000Z');
        expect(result[0].updated).toBe('2021-08-01T19:58:51.000Z');
        expect(result[0].user.id).toBe(2);
        expect(result[1].id).toBe(2);
        expect(result[1].title).toBe('The 2nd one');
      });
  });

  it('It is not possible to post e new Post with a blank title', async () => {
    await frisby
      .post(`${url}/user/login`, {
        email: 'johndoe@gmail.com',
        user_password: '123456',
      })
      .expect('status', 201)
      .then((response) => {
        const { json } = response;
        expect(json.token).not.toBeNull();
        token = json.token;
      });

    await frisby
      .setup({
        request: {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        },
      })
      .post(`${url}/post`, {
        title: '',
        content: 'again posting',
      })
      .expect('status', 400)
      .then((response) => {
        const { json } = response;
        expect(json.message).toBe(
          'child "title" fails because ["title" is not allowed to be empty]',
        );
      });
  });

  it('It is not possible to post e new Post with a blank content', async () => {
    await frisby
      .post(`${url}/user/login`, {
        email: 'johndoe@gmail.com',
        user_password: '123456',
      })
      .expect('status', 201)
      .then((response) => {
        const { json } = response;
        expect(json.token).not.toBeNull();
        token = json.token;
      });

    await frisby
      .setup({
        request: {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        },
      })
      .post(`${url}/post`, {
        title: 'The 3thd one',
        content: '',
      })
      .expect('status', 400)
      .then((response) => {
        const { json } = response;
        expect(json.message).toBe(
          'child "content" fails because ["content" is not allowed to be empty]',
        );
      });
  });

  it('It is not possible to post without token', async () => {
    await frisby
      .post(`${url}/post`, {
        title: 'The 3thd one',
        content: 'again posting',
      })
      .expect('status', 401)
      .then((response) => {
        const { json } = response;
        expect(json.message).toBe('missing auth token');
      });
  });

  it('It is not possible to post with a wrong token', async () => {
    await frisby
      .setup({
        request: {
          headers: {
            Authorization: 'wrongToken',
            'Content-Type': 'application/json',
          },
        },
      })
      .post(`${url}/post`, {
        title: 'The 3thd one',
        content: 'again posting',
      })
      .expect('status', 401)
      .then((response) => {
        const { json } = response;
        expect(json.message).toBe('jwt malformed');
      });
  });

  it('It is possible to delete a Post ', async () => {
    let token;
    await frisby
      .post(`${url}/user/login`, {
        email: 'johndoe@gmail.com',
        user_password: '123456',
      })
      .expect('status', 201)
      .then((response) => {
        const { body } = response;
        const result = JSON.parse(body);
        token = result.token;
      });

    await frisby
      .setup({
        request: {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        },
      })
      .delete(`${url}/post/1`)
      .expect('status', 204);
  });

  it('It is not possible to delete a Post with logged user different of the one who created it', async () => {
    let token;
    await frisby
      .post(`${url}/user/login`, {
        email: 'johndoe@gmail.com',
        user_password: '123456',
      })
      .expect('status', 201)
      .then((response) => {
        const { body } = response;
        const result = JSON.parse(body);
        token = result.token;
      });

    await frisby
      .setup({
        request: {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        },
      })
      .delete(`${url}/post/2`)
      .expect('status', 401)
      .then((response) => {
        const { json } = response;
        expect(json.message).toBe('user not granted');
      });
  });

  it('It is not possible to delete a non existing Post', async () => {
    let token;
    await frisby
      .post(`${url}/user/login`, {
        email: 'johndoe@gmail.com',
        user_password: '123456',
      })
      .expect('status', 201)
      .then((response) => {
        const { body } = response;
        const result = JSON.parse(body);
        token = result.token;
      });

    await frisby
      .setup({
        request: {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        },
      })
      .delete(`${url}/post/99`)
      .expect('status', 404)
      .then((response) => {
        const { json } = response;
        expect(json.message).toBe('Post not found');
      });
  });

  it('It is not possible to delete a Post with empty token', async () => {
    let token;
    await frisby
      .post(`${url}/user/login`, {
        email: 'johndoe@gmail.com',
        user_password: '123456',
      })
      .expect('status', 201);

    await frisby
      .setup({
        request: {
          headers: {
            Authorization: '',
            'Content-Type': 'application/json',
          },
        },
      })
      .delete(`${url}/post/1`)
      .expect('status', 401)
      .then((response) => {
        const { json } = response;
        expect(json.message).toBe('missing auth token');
      });
  });

  it('It is not possible to delete a Post with a wrong token', async () => {
    let token;
    await frisby
      .post(`${url}/user/login`, {
        email: 'johndoe@gmail.com',
        user_password: '123456',
      })
      .expect('status', 201);

    await frisby
      .setup({
        request: {
          headers: {
            Authorization: 'wrongToken',
            'Content-Type': 'application/json',
          },
        },
      })
      .delete(`${url}/post/1`)
      .expect('status', 401)
      .then((response) => {
        const { json } = response;
        expect(json.message).toBe('jwt malformed');
      });
  });
});
