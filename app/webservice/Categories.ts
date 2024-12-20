import { AuthVars } from "constant";

import { Get, Post } from "./Gate";

const get = async (catID) => {
  const response = await Post(AuthVars.API_LINK + "/viewcategory/", {
    auth_key: AuthVars.AUTH_KEY,
    client: "smartwpapp",
    cat_id: catID,
  });
  return response.result;
};

const list = async () => {
  const response = await Post(AuthVars.API_LINK + "/get_taxonomy/", {
    auth_key: AuthVars.AUTH_KEY,
    client: "smartwpapp",
    perpage: "-1",
  });
  return response.result;
};

const tags = async () => {
  const response = await Post(AuthVars.API_LINK + "/tags/", {
    auth_key: AuthVars.AUTH_KEY,
    client: "smartwpapp",
    perpage: "-1",
  });
  return response.result;
};

export { list, tags, get };
