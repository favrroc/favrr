export function setLocalStorageWithExpiry(key: string, value: string, ttl: number) {
  const item = {
    value: value,
    expiry: Date.now() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

export function getLocalStorageWithExpiry(key: string) {
  const itemStr = localStorage.getItem(key);
  // if the item doesn't exist, return null
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  // compare dates of localStorage Item and now
  if (now.getTime() > item.expiry) {
    //If expired remove the localStorage Item
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
}