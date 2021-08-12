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

beforeEach(async () => {
  shell.exec('npx sequelize-cli db:drop');
  shell.exec('npx sequelize-cli db:create && npx sequelize-cli db:migrate $');
  shell.exec('npx sequelize-cli db:seed:all $');

});

describe('Tests the endpoint `/post` - Edit Posts', () => {
   it('It should be possible to edit a Post ', async () => {
    const getAllPostsQuery = readFileSync(
      './tests/sqlQueryTests/getAllPosts.sql',
      'utf8',
    ).trim();
    const expectedResult = require('./resultsQueryTests/PutReturn');

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
        content:
          'Post edited ....Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
      })
      .expect('status', 200);
    expect(await sequelize.query(getAllPostsQuery, { type: 'SELECT' })).toEqual(
      expectedResult,
    );
  });

  it('It should be not possible to edit a Post logged with user different the one who create this post', async () => {
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

  it('It should be not possible to edit a Post a Post with empty token', async () => {
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

  it('It should be not possible to edit a Post with a wrong token', async () => {
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
        expect(json.message).toBe(
          'child "title" fails because ["title" is required]',
        );
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
        expect(json.message).toBe(
          'child "content" fails because ["content" is required]',
        );
      });
  });
});
