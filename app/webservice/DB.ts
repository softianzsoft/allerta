import { Platform } from "react-native";
import * as SQLite from "expo-sqlite";
import moment from "moment";

const boot = async () => {
  const db = openDatabase();
  const version = await getSettings("version", false);

  if (!version) {
    console.log("building DB from scratch");
    db.transaction(async (tx) => {
      await tx.executeSql(
        "CREATE TABLE IF NOT EXISTS settings (id VARCHAR(100) PRIMARY KEY NOT NULL, value TEXT, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);"
      );
      await tx.executeSql(
        "CREATE TABLE IF NOT EXISTS profiles (id INTEGER PRIMARY KEY NOT NULL, userid INTEGER, name VARCHAR(100), username VARCHAR(150), email VARCHAR(200), photo VARCHAR(200), accesstoken TEXT);"
      );
      await tx.executeSql(
        "CREATE TABLE IF NOT EXISTS bookmarks (postid INTEGER PRIMARY KEY NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);"
      );
      saveSettings("version", "1");
    });
  } else {
    console.log("DB version", version);
    switch (parseInt(version)) {
      case 2:
        break;
    }
  }
};

const saveSettings = async (option, value) => {
  const db = openDatabase();
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM settings WHERE id = ?", [option], (_, {rows}) => {
        if (rows.length > 0) {
          tx.executeSql("UPDATE settings SET value=?, updated_at=DATETIME('now') WHERE id = ?;", [value, option],
            () => {
              console.log(option + " Data Updated");
              resolve(true);
            },
            (sql, err) => {
              console.log("SQL error", err);
              resolve(false);
            });
        } else {
          tx.executeSql("INSERT INTO settings (id, value) VALUES (?, ?);", [option, value],
            () => {
              console.log(option + " Data Inserted");
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
};

const getSettings = async (option, defValue, expire = 0) => {
  const db = openDatabase();
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM settings WHERE id = ?", [option], (_, { rows }) => {
          if (rows._array[0]?.value && (expire === 0 || (moment(rows._array[0].updated_at).valueOf() + expire) > Date.now())) {
            console.log("returned from DB", option);
            resolve(rows._array[0].value);
          } else {
            if (expire > 0 && rows._array[0]?.updated_at) {
              console.log("expired", rows._array[0].updated_at);
            }
            resolve(defValue);
          }
        },
        (sql, err) => {
          console.log("SQL error", err);
          resolve(defValue);
        });
    });
  });
  return await promise;
};

const openDatabase = () => {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }
  return SQLite.openDatabase("smart_wp.db");
};

export { openDatabase, boot, saveSettings, getSettings };
