import PostService from '../../services/postsAPI';
import { loadFromLocalStorage } from '../../services/localStorage';

class PublishManager {
  async publishPost(post) {
    const token = await loadFromLocalStorage('WallAppToken');
    console.log('response publish manager post', post);

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
    console.log('response publish manager ', response);
    if (response?.status === 201) {
      return response;
    }
    return response.data.message
      ? response
      : { data: { message: 'something wrong happened' } };
  }
}

export default new PublishManager();
