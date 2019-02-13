import { LOADING, IDLE } from "../actiontypes";

export default (state = { isLoading: false, message: "" }, action) => {
  let { type, message } = action;

  switch (type) {
    case LOADING:
      return { isLoading: true, message };
    case IDLE:
      return { isLoading: false, message: "" };
    default:
      return state;
  }
};
