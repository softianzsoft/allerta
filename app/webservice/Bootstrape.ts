import { AuthVars } from "constant";

import { Post } from "./Gate";
import { openDatabase, getSettings, saveSettings } from "./DB";

const build = async () => {
  const promise = new Promise((resolve, reject) => {
    getSettings("config", false, 86400000).then(async (config) => {
      if (!config) {
        const response = await Post(AuthVars.API_LINK + "/appBootstrape/", {
          auth_key: AuthVars.AUTH_KEY,
          client: "smartwpapp",
          lite_version: "enabled",
        });
        if (response.respond === 1) {
          await saveSettings("config", JSON.stringify(response.result));
          resolve(response.result);
        }
      } else {
        resolve(JSON.parse(config));
      }
    });
  });
  return await promise;
};

const load = async () => {
  const db = openDatabase();
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM settings WHERE id = 'config'", [], (_, { rows }) => {
        resolve(JSON.parse(rows._array[0].value));
      });
    });
  });
  return await promise;
};

export { load, build };
