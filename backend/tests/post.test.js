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
describe('Tests the endpoint `/post`', () => {
  it('It is possible to post e new Post', async () => {
    const challengeQuery = readFileSync(
      './tests/sqlQueryTests/getAllPosts.sql',
      'utf8',
    ).trim();
    const expectedResult = require('./resultsQueryTests/getAllPostsReturn');
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
});
