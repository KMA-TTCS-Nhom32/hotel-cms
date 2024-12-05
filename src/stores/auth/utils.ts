import { LoginResponseDto } from "@ahomevilla-hotel/node-sdk";

const getAuthLocalStorage = () => {
  try {
    const authData = localStorage.getItem(process.env.LOCAL_STORAGE_KEY as string);
    return authData ? JSON.parse(authData) as LoginResponseDto : null;
  } catch {
    return null;
  }
};

export const getAccessToken = () => {
  const data = getAuthLocalStorage();

  return data?.accessToken ?? null;
};

export const getRefreshToken = () => {
  const data: any = getAuthLocalStorage();

  return data?.refreshToken ?? null;
};
