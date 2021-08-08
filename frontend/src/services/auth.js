import { loadFromLocalStorage } from '../services/localStorage'
import jwtDecode from 'jwt-decode';

  export const checkUserAuthorization = () => {
    const token = loadFromLocalStorage('WallAppToken')

    if (token != null) {
      const decoded = jwtDecode(token);
      console.log("token decoded:", decoded);
      const now = Date.now().valueOf() / 1000;
      if (typeof decoded.exp !== 'undefined' && decoded.exp > now) {
        console.log("decoded", decoded);
        const user = {
          id: decoded.id,
          name: decoded.name,
          email: decoded.email,
        };
        return { authorized: true, user };
      }
    }
    return { authorized: false, user: "" };
  }

