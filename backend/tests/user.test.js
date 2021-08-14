const frisby = require('frisby');
const shell = require('shelljs');
const { Sequelize } = require('sequelize');
const { readFileSync } = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: './../.env'}) 

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

describe('Tests the endpoint `/users`', () => {
  it('It is possible to post e new user', async () => {
    const getAllUsersQuery = readFileSync(
      './tests/sqlQueryTests/getAllUsers.sql',
      'utf8',
    ).trim();
    const expectedResult = require('./resultsQueryTests/getAllUsersReturn');

    await frisby
      .post(`${url}/user/register`, {
        user_name: 'user4ForTest',
        email: 'user4@gmail.com',
        user_password: '444444',
      })
      .expect('status', 201)
      .then((response) => {
        const { body } = response;
        expect(body.token).not.toBeNull();
      });

    expect(await sequelize.query(getAllUsersQuery, { type: 'SELECT' })).toEqual(
      expectedResult,
    );
  });

  it('It will be verify that is not possible to register with a name length < 6 characters', async () => {
    await frisby
      .post(`${url}/user/register`, {
        user_name: 'user4',
        email: 'user44@gmail.com',
        user_password: '444444',
      })
      .expect('status', 400)
      .then((response) => {
        const { body } = response;
        const result = JSON.parse(body);
        expect(result.message).toBe(
          'child \"user_name\" fails because [\"user_name\" length must be at least 8 characters long]',
        );
      });
  });

  it('It will be verify that is not possible to register with email with a wrong format ', async () => {
    await frisby
      .post(`${url}/user/register`, {
        user_name: 'user4ForTest',
        email: 'user4gmail.com',
        user_password: '444444',
      })
      .expect('status', 400)
      .then((response) => {
        const { body } = response;
        const result = JSON.parse(body);
        expect(result.message).toBe('child \"email\" fails because [\"email\" must be a valid email]');
      });
  });

  it('It will be verify that is not possible to register with password with a wrong format ', async () => {
    await frisby
      .post(`${url}/user/register`, {
        user_name: 'user4ForTest',
        email: 'user42@gmail.com',
        user_password: '444',
      })
      .expect('status', 400)
      .then((response) => {
        const { body } = response;
        const result = JSON.parse(body);
        expect(result.message).toBe(
          'child \"user_password\" fails because [\"user_password\" length must be 6 characters long]',
        );
      });
  });
});

describe('Tests the endpoint `/login`', () => {
  it('It is possible to login successfully', async () => {
    await frisby
      .post(`${url}/user/login`, {
        email: 'johndoe@gmail.com',
        user_password: '123456',
      })
      .expect('status', 201)
      .then((response) => {
        const { body } = response;
        expect(response.token).not.toBeNull();
      });
  });

  it('It will be verify that is not possible to login with empty email', async () => {
    await frisby
      .post(`${url}/user/login`, {
        email: '',
        user_password: '123456',
      })
      .expect('status', 400) 
      .then((response) => {
        const { body } = response;
        const result = JSON.parse(body);
        expect(result.message).toBe('child \"email\" fails because [\"email\" is not allowed to be empty]');
      });
  });

  it('It will be verify that is not possible to login with empty password', async () => {
    await frisby
      .post(`${url}/user/login`, {
        email: 'johndoe@gmail.com',
        user_password: '',
      })
      .expect('status', 400) 
      .then((response) => {
        const { body } = response;
        const result = JSON.parse(body);

        expect(result.message).toBe('child \"user_password\" fails because [\"user_password\" is not allowed to be empty]');
      });
  });

  it('It will be verify that is not possible to login without password field', async () => {
    await frisby
      .post(`${url}/user/login`, {
        email: 'johndoe@gmail.com',
      })
      .expect('status', 400) 
      .then((response) => {
        const { body } = response;
        const result = JSON.parse(body);
        expect(result.message).toBe('child \"user_password\" fails because [\"user_password\" is required]');
      });
  });

  it('It will be verify that is not possible to login with an non existing user', async () => {
    await frisby
      .post(`${url}/user/login`, {
        email: 'notexistingusar@gmail.com',
      })
      .expect('status', 400) 
      .then((response) => {
        const { body } = response;
        const result = JSON.parse(body);

        expect(result.message).toBe('child \"user_password\" fails because [\"user_password\" is required]');
      });
  });

  it('It will be verify that is not possible to login with a wrong password', async () => {
    await frisby
      .post(`${url}/user/login`, {
        email: 'johndoe@gmail.com',
        user_password: '12121212',
      })
      .expect('status', 400) 
      .then((response) => {
        const { body } = response;
        const result = JSON.parse(body);

        expect(result.message).toBe('Invalid login and/or password');
      });
  });
});
