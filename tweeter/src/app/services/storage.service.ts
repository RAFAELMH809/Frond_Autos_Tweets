import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  //setSession(key: string, obj: any) {
    //sessionStorage.setItem(key, JSON.stringify(obj))
  //}

  setSession(key: string, obj: any) {
  if (typeof obj === 'string') {
    sessionStorage.setItem(key, obj);
  } else {
    sessionStorage.setItem(key, JSON.stringify(obj));
  }
}


  getSession(key: string) {
   const value = sessionStorage.getItem(key);

  // Si es null, devuelve null directamente
  if (!value) return null;

  try {
    return JSON.parse(value); // Intentar parsear como JSON
  } catch (e) {
    return value; // Si falla, es string plano (como un token)
  }
}
  sessionDeleteAll() {
    sessionStorage.clear();
  }

  sessionDeleteByKey(key: string) {
    sessionStorage.removeItem(key);
  }

  setLocal(key: string, obj: any) {
    localStorage.setItem(key, JSON.stringify(obj));
  }

  getLocal(key: string) {
    const obj = localStorage.getItem(key);
    return obj ? JSON.parse(obj) : null;
  }

  localDeleteAll() {
    localStorage.clear();
  }

  localDeleteByKey(key: string) {
    localStorage.removeItem(key);
  }

  getSessionString(key: string): string | null {
  return sessionStorage.getItem(key);
}

setSessionString(key: string, value: string): void {
  sessionStorage.setItem(key, value);
}




}