import axios from 'axios';

class PostService {
  constructor() {
    const url = 'http://localhost:3000';
    const timeout = 30000;

    this.http = axios.create({
      baseURL: url,
      timeout,
    });

    // Define the  handlers
    this.http.interceptors.response.use(this.handleSuccess, this.handleError);
  }

  handleSuccess(response) {
    return response;
  }

  handleError(error) {
    return error.response;
  }

  /** Get Posts */
  async getAllPosts(token) {
    return this.http.post('post', {
      headers: {
        Authorization: token,
      },
    });
  }
}

export default new PostService();
