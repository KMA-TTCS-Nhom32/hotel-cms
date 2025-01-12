export const API_PATH = {
  // Auth
  LOGIN: '/auth/login',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/profile',

  // Province
  PROVINCES: '/provinces',

  // Branches
  BRANCHES: '/branches',

  // Amenities
  AMENITIES: '/amenities',

  // Images
  IMAGES: '/images',

  // POEditor
  TRANSLATION_LIST: '/poeditor/translations-list',

  // Room Details
  ROOM_DETAILS: '/room-details',

  // Room Price Histories
  ROOM_PRICE_HISTORIES: '/room-price-histories',
  GET_ROOM_PRICE_HISTORIES: (roomDetailId: string) =>
    '/room-price-histories/room-detail/' + roomDetailId,
};
