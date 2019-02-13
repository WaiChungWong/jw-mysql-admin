import axios from "axios";

const API_URL = window.location.pathname + "api/";

export const ERROR_NO_RESPOND = "Connection failed";
export const ERROR_DATABASE_NO_RESPOND = "Database connection failed";
export const ERROR_HOST_NOT_FOUND = "Host not found";
export const ERROR_AUTHORIZE_FAILED = "Incorrect user or password";
export const ERROR_UNKNOWN = "Unknown error";

export const ERROR_INVALID_TOKEN = "invalid signature";

const request = async (path, method) => {
  let error, result;
  let url = API_URL + path;

  try {
    let { status, data } = await method(url);

    // When the server respond succussfully.
    if (status === 200) {
      result = data && data.result;
    }
    // When the server respond with an error.
    else {
      error = (data && data.error) || { message: ERROR_UNKNOWN };
    }
  } catch (e) {
    // When the server failed to respond.
    error = (e && e.response && e.response.data && e.response.data.error) || {
      message: ERROR_NO_RESPOND
    };
  }

  return [error && error.message, result];
};

export const get = (path, params) =>
  request(path, url => axios.get(url, { params }));

export const post = (path, info) => request(path, url => axios.post(url, info));

export const getFormData = form => {
  if (!form || form.nodeName !== "FORM") {
    return;
  }

  let data = {};

  for (let i = form.elements.length - 1; i >= 0; i--) {
    let element = form.elements[i];

    if (element.name === "" || element.disabled) {
      continue;
    }

    switch (element.nodeName) {
      case "INPUT":
        switch (element.type) {
          case "text":
          case "hidden":
          case "password":
          case "button":
          case "reset":
          case "submit":
          case "number":
          case "date":
            data[element.name] = element.value;
            break;
          case "checkbox":
          case "radio":
            if (element.checked) {
              data[element.name] = element.value;
            }
            break;
          case "file":
          default:
            break;
        }
        break;
      case "TEXTAREA":
        data[element.name] = element.value;
        break;
      case "SELECT":
        switch (element.type) {
          case "select-one":
            data[element.name] = element.value;
            break;
          case "select-multiple":
            data[element.name] = [];
            for (let j = element.options.length - 1; j >= 0; j--) {
              if (element.options[j].selected) {
                data[element.name].push(element.options[j].value);
              }
            }
            break;
          default:
            break;
        }
        break;
      case "BUTTON":
        switch (element.type) {
          case "reset":
          case "submit":
          case "button":
            data[element.name] = element.value;
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  }

  return data;
};
