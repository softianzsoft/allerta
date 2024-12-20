import { AuthVars } from "constant";

import { Post } from "./Gate";

const saveDeviceToken = async (token: string, type: string, userid, latitude, longitude) => {
  return await Post(AuthVars.PUSH_LINK + "savetoken", {
    auth_key: AuthVars.PUSH_AUTH_KEY,
    user_id: userid ? userid : 0,
    device_token: token,
    device_type: type,
    latitude: latitude,
    longitude: longitude,
  });
};

const getNotifications = async (pageNum: number, userId: number) => {
  return await Post(AuthVars.PUSH_LINK + "get_archive", {
    auth_key: AuthVars.PUSH_AUTH_KEY,
    userid: userId,
    mainPlatforms: "mobile",
    callpage: pageNum,
    perpage: "10",
  });
};

const getSubscription = async (userId: number) => {
  return await Post(AuthVars.PUSH_LINK + "subscription", {
    auth_key: AuthVars.PUSH_AUTH_KEY,
    client: "smartwpapp",
    user_id: userId,
  });
};

const delSubscription = async (userId: number) => {
  return await Post(AuthVars.PUSH_LINK + "deletetoken", {
    auth_key: AuthVars.PUSH_AUTH_KEY,
    client: "smartwpapp",
    user_id: userId,
  });
};

const saveSubscription = async (userId: number, categories, channels, keywords: string, web: number, mobile: number, msn: number, email: number) => {
  return await Post(AuthVars.PUSH_LINK + "/save_subscription/", {
    auth_key: AuthVars.PUSH_AUTH_KEY,
    user_id: userId,
    "categories[]": categories,
    "channels[]": channels,
    keywords: keywords,
    web: web,
    mobile: mobile,
    msn: msn,
    email: email,
  });
};

export { saveDeviceToken, getNotifications, getSubscription, saveSubscription, delSubscription };
