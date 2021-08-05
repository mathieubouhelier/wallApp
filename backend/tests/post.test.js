const frisby = require('frisby');
const shell = require('shelljs');
const { Sequelize } = require('sequelize');
const { readFileSync } = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: './../.env' });

const url = `http://${process.env.HOSTNAME}:${process.env.PORT}`;
console.log('url', url);
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

beforeEach(async () => {
  shell.exec('npx sequelize-cli db:drop');
  shell.exec('npx sequelize-cli db:create && npx sequelize-cli db:migrate $');
  shell.exec('npx sequelize-cli db:seed:all $');
});
describe('Tests the endpoint `/post`', () => {
  it.skip('It is possible to post e new Post', async () => {
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

  it.skip('It is not possible to post e new Post with a blank title', async () => {
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
        expect(json.message).toBe('"title" is required');
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
        expect(json.message).toBe('"content" is required');
      });
  });

  it.skip('It is not possible to post without token', async () => {
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

  it.skip('It is not possible to post with a wrong token', async () => {
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

  it.skip('It is possible to delete a Post ', async () => {
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

  it.skip('It is not possible to delete a Post with logged user different of the one who created it', async () => {
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

  it.skip('It is not possible to delete a non existing Post', async () => {
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

  it.skip('It is not possible to delete a Post with empty token', async () => {
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

  it.skip('It is not possible to delete a Post with a wrong token', async () => {
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

  it.skip('It should be possible to edit a Post ', async () => {
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
      .put(`${url}/post/1`, {
        title: 'post (edited)',
        content: 'Post edited ....',
      })
      .expect('status', 204);
  });

  it.skip('It should be not possible to edit a Post logged with user different the one who create this post', async () => {
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
      .put(`${url}/post/2`, {
        title: 'post (edited)',
        content: 'Post edited ....',
      })
      .expect('status', 401)
      .then((response) => {
        const { json } = response;
        expect(json.message).toBe('user not granted');
      });
  });

  it.skip('It should be not possible to edit a Post a Post with empty token', async () => {
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
      .put(`${url}/post/1`, {
        title: 'post (edited)',
        content: 'Post edited ....',
      })
      .expect('status', 401)
      .then((response) => {
        const { json } = response;
        expect(json.message).toBe('missing auth token');
      });
  });


  it.skip('It should be not possible to edit a Post with a wrong token', async () => {
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
      .put(`${url}/post/1`, {
        title: 'post (edited)',
        content: 'Post edited ....',
      })
      .expect('status', 401)
      .then((response) => {
        const { json } = response;
        expect(json.message).toBe('jwt malformed');
      });
  });


  it('It should not be possible to edit a Post with empty title', async () => {
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
      .put(`${url}/post/1`, {
        content: 'Post edited ....',
      })
      .expect('status', 400)
      .then((response) => {
        const { json } = response;
        expect(json.message).toBe('"title" is required');
      });
  });

  it('It should not be possible to edit a Post with empty content', async () => {
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
      .put(`${url}/post/1`, {
        title: 'Post edited',
      })
      .expect('status', 400)
      .then((response) => {
        const { json } = response;
        expect(json.message).toBe('"content" is required');
      });
  });

});
