import { LoginAPI } from "webservice";

const webLogin = async (username, password) => {
  return await LoginAPI.login(username, password).then(async (response) => {
    if (response.respond === 0) {
      return response.message;
    } else {
      await LoginAPI.setUser(LoginAPI.profileBakery(response));
      return true;
    }
  });
};

const webRegister = async (username, password, email) => {
  return await LoginAPI.signup(username, password, email).then(async (response) => {
    if (response.respond === 0) {
      return response.message;
    } else {
      await LoginAPI.setUser(LoginAPI.profileBakery(response));
      return true;
    }
  });
};

export { webLogin, webRegister };
