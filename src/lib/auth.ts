import Axios from "axios";
import { stringify } from "querystring";
import { Onedrive } from "../env";

export const getAccessToken = async () => {
  try {
    const response = await Axios.post(
      "https://login.microsoftonline.com/common/oauth2/v2.0/token",
      stringify({
        redirect_uri: Onedrive.redirectUri,
        client_id: Onedrive.clientId,
        client_secret: Onedrive.clientSecret,
        refresh_token: Onedrive.refreshToken,
        grant_type: "refresh_token",
      })
    );
    return response.data["access_token"];
  } catch (e) {
    console.error("access token error:", e);
  }
};
