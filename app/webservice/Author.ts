import { AuthVars } from "constant";

import { Post } from "./Gate";

const get = async (authorID) => {
  const response = await Post(AuthVars.API_LINK + "/get_author/", {
    auth_key: AuthVars.AUTH_KEY,
    client: "smartwpapp",
    author_id: authorID,
  });
  return response.result[0];
};

const terminate = async (accessToken) => {
  const response = await Post(AuthVars.API_LINK + "/delete_myaccount/", {
    auth_key: AuthVars.AUTH_KEY,
    client: "smartwpapp",
    ACCESS_TOKEN: accessToken,
  });
  return response.result;
};

const update = async (accessToken, fullname, website, about) => {
  const response = await Post(AuthVars.API_LINK + "/edit_profile/", {
    auth_key: AuthVars.AUTH_KEY,
    client: "smartwpapp",
    ACCESS_TOKEN: accessToken,
    display_name: fullname,
    user_url: website,
    description: about,
    //file64: image,
  });
  return response.result;
};

export { update, get, terminate };
