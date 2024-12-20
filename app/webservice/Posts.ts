import { AuthVars } from "constant";

import { Get, Post } from "./Gate";

const list = async (page = 1, catID = 0) => {
  const response = await Post(AuthVars.API_LINK + "/getposts/", {
    auth_key: AuthVars.AUTH_KEY,
    taxonomy_id: catID,
    client: "smartwpapp",
    disable_content_filters: "1",
    orderby: "posts.post_modified",
    callpage: page,
    perpage: "10",
  });
  return response;
};

const search = async (page = 1, query = 0) => {
  const response = await Post(AuthVars.API_LINK + "/search_posts/", {
    auth_key: AuthVars.AUTH_KEY,
    query: query,
    client: "smartwpapp",
    disable_content_filters: "1",
    orderby: "posts.post_modified",
    callpage: page,
    perpage: "10",
  });
  return response;
};

const like = async (accessToken, postID) => {
  const response = await Post(AuthVars.API_LINK + "/custom_service/", {
    auth_key: AuthVars.AUTH_KEY,
    client: "smartwpapp",
    service: "likepost",
    postid: postID,
    ACCESS_TOKEN: accessToken,
  });
  return response;
};

const bookmarks = async (ids) => {
  const response = await Post(AuthVars.API_LINK + "/getposts/", {
    auth_key: AuthVars.AUTH_KEY,
    client: "smartwpapp",
    get_ids: ids.join(","),
    disable_content_filters: "1",
  });
  return response;
};

const get = async (postID = 0) => {
  const response = await Post(AuthVars.API_LINK + "/getpost/", {
    auth_key: AuthVars.AUTH_KEY,
    client: "smartwpapp",
    post_id: postID,
    disable_content_filters: "1",
  });
  return response;
};

const page = async (pageID = 0) => {
  const response = await Post(AuthVars.API_LINK + "/getpage/", {
    auth_key: AuthVars.AUTH_KEY,
    client: "smartwpapp",
    pageid: pageID,
  });
  return response;
};

const highlight = async (catID = 0, mode = false, page) => {
  const response = await Post(AuthVars.API_LINK + "/getposts/", {
    auth_key: AuthVars.AUTH_KEY,
    client: "smartwpapp",
    custom_meta_and: mode ? "{\"smart_highlight_post\":\"='1'\"}" : "",
    categoryid: catID !== 0 ? catID : "",
    orderby: "posts.post_modified",
    perpage: "10",
    callpage: page,
  });
  return response;
};

const slider = async (catID = 0) => {
  const response = await Post(AuthVars.API_LINK + "/getposts/", {
    auth_key: AuthVars.AUTH_KEY,
    client: "smartwpapp",
    custom_meta_and: "{\"smart_slider_post\":\"='1'\"}",
    categoryid: catID !== 0 ? catID : "",
    orderby: "posts.post_modified",
    perpage: "6",
  });
  return response;
};

const postBakery = (posts = []) => {
  const postsObject = [];
  if (posts.length > 0) {
    Object.keys(posts).map((key) => {
      postsObject.push({
        postId: posts[key].ID,
        img_uri: posts[key].featuredimage === "" ? AuthVars.BLANK_IMAGE : posts[key].featuredimage,
        title: posts[key].post_title,
        publishDate: posts[key].post_modified,
        weblink: posts[key].guid,
        likes: posts[key].likes ? parseInt(posts[key].likes) : 0,
        category: posts[key].category[0]?.name ? posts[key].category[0].name : "",
      });
    });
  }
  return postsObject;
};

export { list, get, highlight, slider, postBakery, bookmarks, search, like, page };
