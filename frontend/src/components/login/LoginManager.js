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
    if (response.status === 201) {
      const { token } = response.data;
      console.log(token);
      saveToLocalStorage('WallAppToken', token);
      return response;
    }

    deleteFromLocalStorage('WallAppToken');
    return response?.data.message ? response : {data:{message:'something wrong happened'}};

  }
}

export default new LoginManager();
