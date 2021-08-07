import UserService from '../../services/usersAPI';
import { saveToLocalStorage } from '../../services/localStorage';

class LoginManager {
  async logTheUser(user) {
    return await UserService.userLogin({
      email: user.email,
      user_password: user.password,
    })
      .then((userLoginData) => {
        const { token } = userLoginData.data;
        saveToLocalStorage('WallAppToken', token);
      })
      .catch((error) => console.log(error));
  }
}

export default new LoginManager();
