import PostService from '../../services/postsAPI';
import {
  saveToLocalStorage,
  deleteFromLocalStorage,
} from '../../services/localStorage';

class WallManager {
  async loadAllPosts(token) {
    const response = await PostService.getAllPosts(token);

    if (response.status === 201) {
      const { token } = response.data;
      console.log(token);
      saveToLocalStorage('WallAppToken', token);
      return response;
    }

    deleteFromLocalStorage('WallAppToken');
    return response.data.message ? response : {data:{message:'something wrong happened'}};

  }
}

export default new WallManager();
