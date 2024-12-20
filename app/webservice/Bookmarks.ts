import { openDatabase } from "./DB";

const add = (postID) => {
  const db = openDatabase();

  db.transaction((tx) => {
    tx.executeSql("INSERT INTO bookmarks (postid) VALUES (?)", [postID]);
  });
};

const getAll = async () => {
  const db = openDatabase();
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql("SELECT * from bookmarks ORDER BY created_at DESC", [], (_, { rows }) => {
        let post_ids = [];
        if (rows._array.length > 0) {
          rows._array.forEach(post => post_ids.push(parseInt(post.postid)));
        }
        resolve(post_ids);
      });
    });
  });
  return await promise;
};

const remove = async (postID) => {
  const db = openDatabase();
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql("DELETE FROM bookmarks WHERE postid = ?", [postID], (_, { rows }) => {
        resolve(true);
      });
    });
  });
  return await promise;
};

export { add, remove, getAll };
