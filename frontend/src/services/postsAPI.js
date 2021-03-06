import axios from 'axios';

class PostService {
  constructor() {
    const url = process.env.REACT_APP_API_URL || 'http://localhost:3000';
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
    return this.http.post('post', post, {
      headers: {
        authorization: token,
      },
    });
  }

  /** Get Posts */
  async getAllPosts() {
    return this.http.get('/post');
  }

  /** Update  one (id) post */
  async updatePost(post, token, id) {
    return this.http.put(`/post/${id}`, post, {
      headers: { Authorization: token },
    });
  }

  /** Delete one (id) post */
  async deleteOne(token, id) {
    return this.http.delete(`/post/${id}`, {
      headers: { Authorization: token },
    });
  }
}

export default new PostService();
