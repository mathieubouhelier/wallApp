import UserService from '../../services/usersAPI';
import {
  saveToLocalStorage,
  deleteFromLocalStorage,
} from '../../services/localStorage';

class LoginManager {
  async logTheUser(user) {
    const response = await UserService.userLogin({
      email: user.email,
      user_password: user.password,
    });

    console.log('reponseLoginManager', response);

    if (response.status === 201) {
      const { token } = response.data;
      console.log(token);
      saveToLocalStorage('WallAppToken', token);
      return response;
    }

    deleteFromLocalStorage('WallAppToken');
    return response;
  }
}

export default new LoginManager();
