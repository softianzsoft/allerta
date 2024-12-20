import { AuthVars } from "constant";

import { Get, Post } from "./Gate";

const list = async (page = 1, postID = 0) => {
  const response = await Post(AuthVars.API_LINK + "/getComments/", {
    auth_key: AuthVars.AUTH_KEY,
    post_id: postID,
    client: "smartwpapp",
    callpage: page,
    perpage: "10",
  });
  return response;
};

const get = async (postID = 0) => {
  const response = await Post(AuthVars.API_LINK + "/get_comment/", {
    auth_key: AuthVars.AUTH_KEY,
    client: "smartwpapp",
    post_id: postID,
  });
  return response;
};

const add = async (postID = 0, content, accessToken) => {
  const response = await Post(AuthVars.API_LINK + "/newcomment/", {
    auth_key: AuthVars.AUTH_KEY,
    ACCESS_TOKEN: accessToken,
    client: "smartwpapp",
    post_id: postID,
    content: content,
  });
  return response;
};

export { list, get, add };
