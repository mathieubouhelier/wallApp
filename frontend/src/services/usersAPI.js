import axios from 'axios';

const fiftyHundred = 500;

class UserService {
  constructor() {
    const url = 'http://localhost:3000';
    const timeout = 30000;

    this.http = axios.create({
      baseURL: url,
      timeout,
    });

    // Define os handlers para tratamento de erro e sucesso
    this.http.interceptors.response.use(this.handleSuccess, this.handleError);
  }

  handleSuccess(response) {
    return response;
  }

  handleError(error) {
    return error.response;
  }

  /** User login */
  async userLogin(body) {
    return this.http.post('user/login', body);
  }

  /** User signup */
  async userSignup(body) {
    console.log("body", body);
      return this.http.post('use/register', body);
  }

}

export default new UserService();
