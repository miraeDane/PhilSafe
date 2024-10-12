import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private userData: any;
  
  setSessionData(key: string, data: any) {
    sessionStorage.setItem(key, JSON.stringify(data));
  }

  getSessionData(key: string) {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  clearSessionData(key: string) {
    sessionStorage.removeItem(key);
  }

  clearAllSessionData() {
    sessionStorage.clear();
  }

  setUserData(data: any) {
    this.userData = data;
  }

  getUserData() {
    return this.userData;
  }
}
