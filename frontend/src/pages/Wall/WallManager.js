import PostService from '../../services/postsAPI';
import { loadFromLocalStorage } from '../../services/localStorage';


class WallManager {
  async loadAllPosts() {

    const response = await PostService.getAllPosts();
    console.log("response", response);
    if (response?.status === 200) {
      return response;
    }
    return response?.data.message
      ? response
      : { data: [],
         message: 'something wrong happened'  };
  }

  async deleteOnePost(id) {
    const token = await loadFromLocalStorage('WallAppToken');

    if (!token) {
      return { data: { message: 'something wrong happened' } };
    }
    const response = await PostService.deleteOne(token, id);
    if (response.status === 204) {
      return response;
    }
    return response?.data.message
      ? response
      : { data: { message: 'something wrong happened' } };
  }
}

export default new WallManager();
