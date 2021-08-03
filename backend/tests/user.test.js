const frisby = require('frisby');
const shell = require('shelljs');
const { Sequelize } = require('sequelize');
const { readFileSync } = require('fs');
require('dotenv').config();

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
describe('Tests the endpoint `/users`', () => {
  it.skip('It is possible to post e new user', async () => {
    const getAllUsersQuery = readFileSync(
      './tests/sqlQueryTests/getAllUsers.sql',
      'utf8',
    ).trim();
    const expectedResult = require('./resultsQueryTests/getAllUsersReturn');

    await frisby
      .post(`${url}/users/register`, {
        user_name: 'user4ForTest',
        email: 'user4@gmail.com',
        user_password: '444444',
      })
      .expect('status', 201)
      .then((response) => {
        const { json } = response;
        expect(json.token).not.toBeNull();
      });

    expect(await sequelize.query(getAllUsersQuery, { type: 'SELECT' })).toEqual(
      expectedResult,
    );
  });

  it.skip('It will be verify that is not possible to register with a name length < 6 characters', async () => {
    await frisby
      .post(`${url}/users/register`, {
        user_name: 'user4',
        email: 'user4@gmail.com',
        user_password: '444444',
      })
      .expect('status', 400)
      .then((response) => {
        const { json } = response;
        expect(json.message).toBe(
          '"user_name" length must be at least 8 characters long',
        );
      });
  });

  it.skip('It will be verify that is not possible to register with email with a wrong format ', async () => {
    await frisby
      .post(`${url}/users/register`, {
        user_name: 'user4ForTest',
        email: 'user4gmail.com',
        user_password: '444444',
      })
      .expect('status', 400)
      .then((response) => {
        const { json } = response;
        expect(json.message).toBe('"email" must be a valid email');
      });
  });

  it.skip('It will be verify that is not possible to register with password with a wrong format ', async () => {
    await frisby
      .post(`${url}/users/register`, {
        user_name: 'user4ForTest',
        email: 'user4@gmail.com',
        user_password: '444',
      })
      .expect('status', 400)
      .then((response) => {
        const { json } = response;
        expect(json.message).toBe(
          'user_password" length must be at least 8 characters long',
        );
      });
  });
});
