async function Post(url = "", data = {}) {
  const query = Object.keys(data)
    .map((key) => `${key}=${data[key]}`)
    .join("&");
  console.log("New Request", `${url}?${query}`);

  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (key.search(/\[\]/) >= 0) {
      value.forEach((param) => {
        formData.append(key, param);
      });
    } else {
      formData.append(key, value);
    }
  }

  try {
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "default", // *default, no-cache, reload, force-cache, only-if-cached
      //credentials: "same-origin", // include, *same-origin, omit
      headers: {
        //"Content-Type": "application/json",
        "Content-Type": "multipart/form-data",
      },
      redirect: "follow", // manual, *follow, error
      //referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: formData, // body data type must match "Content-Type" header
    });
    if (response.status >= 200 && response.status < 300) {
      return await response.json();
    } else {
      console.log(response.status);
      alert("Something error, please try again later.");
    }
  } catch (err) {
    console.log(err);
    alert("No internet connection");
  }
}

async function Get(url = "", data = {}) {
  const query = Object.keys(data)
    .map((key) => `${key}=${data[key]}`)
    .join("&");

  try {
    const response = await fetch(`${url}?${query}`, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "default", // *default, no-cache, reload, force-cache, only-if-cached
      //credentials: "same-origin", // include, *same-origin, omit
      headers: {
        //"Content-Type": "application/json",
      },
      redirect: "follow", // manual, *follow, error
      //referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    if (response.status >= 200 && response.status < 300) {
      return await response.json();
    } else {
      console.log(response.status);
      alert("Something error, please try again later.");
    }
  } catch (err) {
    console.log(err);
    alert("No internet connection");
  }
}

export { Get, Post };
