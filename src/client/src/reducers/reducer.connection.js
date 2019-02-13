import { DISCONNECTED, UNAUTHORIZED, AUTHORIZED } from "../actiontypes";

export default (state = {}, action) => {
  let { type, requiredFields, message } = action;

  switch (type) {
    case DISCONNECTED:
      return { state: type, message };
    case UNAUTHORIZED:
      message = state.requiredFields ? message : "";
      return { state: type, requiredFields, message };
    case AUTHORIZED:
      return { state: type };
    default:
      return state;
  }
};
