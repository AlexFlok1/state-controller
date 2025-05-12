export function getFromStorage(storage: Storage, name: string) {
    const item = storage.getItem(`sms:segemnt:${name}`);
    return item ? JSON.parse(item) : null;
  }
  
export function setToStorage(storage: Storage, name: string, value: Record<string, any> = {}) {
  storage.setItem(`sms:segemnt:${name}`, JSON.stringify(value));
}

export function getSegmentStorage(storageType: "localStorage" | "sessionStorage") {
  return storageType === "localStorage" ? localStorage : sessionStorage;
}