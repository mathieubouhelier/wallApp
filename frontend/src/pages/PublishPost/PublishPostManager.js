import PostService from '../../services/postsAPI';
import { loadFromLocalStorage } from '../../services/localStorage';

class PublishManager {
  async publishPost(post) {
    const token = await loadFromLocalStorage('WallAppToken');

    if (!token) {
      return { data: { message: 'something wrong happened' } };
    }
    const response = await PostService.publish(
      {
        title: post.title,
        content: post.content,
      },
      token,
    );
    if (response?.status === 201) {
      return response;
    }
    return response?.data.message
      ? response
      : { data: { message: 'something wrong happened' } };
  }
}

export default new PublishManager();
