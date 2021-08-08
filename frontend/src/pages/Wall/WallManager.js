import PostService from '../../services/postsAPI';

class WallManager {
  async loadAllPosts() {
    const response = await PostService.getAllPosts();
    if (response.status === 200) {
      return response;
    }
    return response.data.message
      ? response
      : { data: { message: 'something wrong happened' } };
  }
}

export default new WallManager();
