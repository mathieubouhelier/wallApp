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
  /** post one Post */
  async publish(post, token) {
    console.log("api post", post);
    return this.http.post('post',post, {
      headers: {
        authorization: token,
      },
    });
  }

  /** Get Posts */
  async getAllPosts() {
    return this.http.get('post', {});
  }
}

export default new PostService();
