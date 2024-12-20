import { AuthVars } from "constant";

import { Get, Post } from "./Gate";
import { openDatabase } from "./DB";

const login = async (username = "", password = "") => {
  const response = await Post(AuthVars.API_LINK + "/login/", {
    auth_key: AuthVars.AUTH_KEY,
    scope: "public,posts,comments,profiles,taxonomies,core,publish_comments,edit_profile",
    username: username,
    password: password,
  });
  return response;
};

const signup = async (username = "", password = "", email = "", first_name = "", last_name = "") => {
  const response = await Post(AuthVars.API_LINK + "/signup/", {
    auth_key: AuthVars.AUTH_KEY,
    scope: "public,posts,comments,profiles,taxonomies,core,publish_comments,edit_profile",
    username: username,
    password: password,
    first_name: first_name,
    last_name: last_name,
    email: email,
  });
  return response;
};

const social = async (username, socialid, socialtype, email, name, accessToken) => {
  if (typeof accessToken == "undefined" || accessToken == "") {
    accessToken = "NOTPROVIDED";
  }
  const response = await Post(AuthVars.API_LINK + "/social/", {
    auth_key: AuthVars.AUTH_KEY,
    scope: "public,posts,comments,profiles,taxonomies,core,publish_comments,edit_profile",
    client: "smartwpapp",
    display_name: name,
    username: username,
    socialid: socialid,
    token: accessToken,
    socialtype: socialtype,
    email: email,
  });
  return response;
};

const socialCheck = async (socialid, socialtype) => {
  const response = await Post(AuthVars.API_LINK + "/social_check/", {
    auth_key: AuthVars.AUTH_KEY,
    scope: "public,posts,comments,profiles,taxonomies,core,publish_comments,edit_profile",
    client: "smartwpapp",
    socialid: socialid,
    socialtype: socialtype,
  });
  return response;
};

const lostPWD = async (email) => {
  const response = await Post(AuthVars.API_LINK + "/lostpwd/", {
    auth_key: AuthVars.AUTH_KEY,
    client: "smartwpapp",
    email: email,
  });
  return response;
};

const setUser = async (userData) => {
  const db = openDatabase();
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM profiles WHERE id = ?", [1], (_, { rows }) => {
        console.log("old profiles", JSON.stringify(rows));
        if (rows.length === 0) {
          tx.executeSql("INSERT INTO profiles (userid, name, username, email, photo, accesstoken) VALUES (?, ?, ?, ?, ?, ?)", [userData.id, userData.displayname, userData.username, userData.email, userData.avatar, userData.token],
            () => {
              console.log("Data Inserted");
              resolve(true);
            },
            (sql, err) => {
              console.log("SQL error", err);
              resolve(false);
            });
        } else {
          tx.executeSql("UPDATE profiles SET userid=?, name=?, username=?, email=?, photo=?, accesstoken=? WHERE id = 1;", [userData.id, userData.displayname, userData.username, userData.email, userData.avatar, userData.token],
            () => {
              console.log("Data Inserted");
              resolve(true);
            },
            (sql, err) => {
              console.log("SQL error", err);
              resolve(false);
            });
        }
      });
    });
  });
  return await promise;
  /*db.transaction((tx) => {
    tx.executeSql("SELECT * FROM profiles WHERE id = ?", [1], (_, { rows }) => {
      console.log(JSON.stringify(rows));
      console.log("DB accesstoken", rows._array[0].accesstoken);
    });
  });*/
};

const isLogged = async () => {
  const db = openDatabase();
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM profiles WHERE id = ?", [1], (_, { rows }) => {
        console.log("DB accesstoken", rows._array[0]?.accesstoken);
        if (rows._array[0]?.accesstoken) {
          resolve(rows._array[0]);
        } else {
          resolve(false);
        }
      });
    });
  });
  return await promise;
};

const clearLogin = async () => {
  const db = openDatabase();
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql("DELETE FROM profiles WHERE id = ?", [1], (_, { rows }) => {
        resolve(true);
      });
    });
  });
  return await promise;
};

const profileBakery = (response) => {
  return {
    id: response.result[0].ID,
    token: response.result[0].access_token_data.token,
    username: response.result[0].user_login,
    displayname: response.result[0].display_name,
    email: response.result[0].user_email,
    avatar: response.result[0].avatar,
  };
};

export { login, social, signup, setUser, socialCheck, isLogged, clearLogin, profileBakery, lostPWD };
