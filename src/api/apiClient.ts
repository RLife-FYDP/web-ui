import { decode } from "jsonwebtoken";
import {
  AccessTokenStorageKey,
  RefreshTokenStorageKey,
  SignupPageUrl,
} from "../commonUtils/consts";
import { User } from "../commonUtils/types";

interface JwtToken {
  user_id: number;
}

const BASE_URL = "http://localhost:8080";

const refreshAccessToken = async (refreshToken: string) => {
  const res = await fetch(BASE_URL + "/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
    headers: { "Content-Type": "application/json" },
  });
  if (res.status !== 200) {
    window.location.href = SignupPageUrl;
    return;
  }

  const { access_token: accessToken }: { access_token: string } =
    await res.json();
  localStorage.setItem(AccessTokenStorageKey, accessToken);
  return accessToken;
};

export const authenticatedGetRequest = async (url: string) => {
  let accessToken = localStorage.getItem(AccessTokenStorageKey);
  const refreshToken = localStorage.getItem(RefreshTokenStorageKey);
  if (!refreshToken) {
    window.location.href = SignupPageUrl;
    return;
  }
  const res = await fetch(BASE_URL + url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (res.status === 401) {
    // refresh token
    const newAccessToken = await refreshAccessToken(refreshToken);
    if (!newAccessToken) {
      throw new Error("unable to refresh token");
    }
    accessToken = newAccessToken;
    return fetch(BASE_URL + url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } else {
    return res;
  }
};

export const getUser = async () => {
  const accessToken = localStorage.getItem(AccessTokenStorageKey);
  if (!accessToken) {
    throw new Error("unable to retrieve user");
  }

  const { user_id: userId } = decode(accessToken) as JwtToken;
  const res = await authenticatedGetRequest(`/users/${userId}`);
  const userJson = await res?.json();
  const user: User = {
    age: userJson.age,
    birthday: new Date(userJson.birthday),
    createdAt: new Date(userJson.created_at),
    email: userJson.email,
    expenseItems: [], // TODO
    firstName: userJson.first_name,
    gender: userJson.gender,
    id: userJson.id,
    lastName: userJson.last_name,
    location: {}, //TODO
    profileImageLink: userJson.profile_img_link,
    rating: userJson.rating,
    setting: {}, // TODO
    suiteId: userJson.suite.id,
    updatedAt: new Date(userJson.updated_at),
  };
  return user;
};
