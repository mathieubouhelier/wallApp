import axios from 'axios';



class PostService {
  constructor() {
    // const url = 'http://localhost:3000';
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
    return this.http.post('post',post, {
      headers: {
        authorization: token,
      },
    });
  }

  /** Get Posts */
  async getAllPosts(token) {
    console.log("getAllPosts", token);
    return this.http.get('post', 
    { headers: { Authorization: token } });
  }

  /** Update  one (id) post */
  async updatePost(token, id) {
    return this.http.put(
      `/post/${id}`,
      { headers: { Authorization: token } },
    );
  }

    /** Update  one (id) post */
    async deleteOne(token, id) {
      return this.http.delete(
        `/post/${id}`,
        { headers: { Authorization: token } },
      );
    }

}

export default new PostService();
