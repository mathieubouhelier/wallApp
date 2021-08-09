import UserService from '../../services/usersAPI';
import {
  saveToLocalStorage,
  deleteFromLocalStorage,
} from '../../services/localStorage';

class RegisterManager {
  async logTheUser(user) {
    const response = await UserService.userSignup({
      user_name: user.name,
      email: user.email,
      user_password: user.password,
    });
    if (response?.status === 201) {
      const { token } = response.data;
      saveToLocalStorage('WallAppToken', token);
      return response;
    }
    deleteFromLocalStorage('WallAppToken');
    return response?.data.message ? response : {data:{message:'something wrong happened'}};
  }
}

export default new RegisterManager();
