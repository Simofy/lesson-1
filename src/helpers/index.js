import { storage } from '../const/storage';

export const handleFetch = (url, data) => {
  const token = JSON.parse(localStorage.getItem(storage.token));
  return fetch(url, {
    ...data,
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  });
};

export default {
  handleFetch,
};
