import ky from "ky";

const api = ky.extend({
  prefixUrl: `${process.env.REACT_APP_API_BASE_URL}`,
  hooks: {
    beforeError: [
      (error) => {
        return error;
      },
    ],
  },
});

const userServiceApi = process.env.REACT_APP_USER_SERVICE_BASE_URL;
export { api, userServiceApi };
