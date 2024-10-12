// src/app/services/loading.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private refreshSubject = new BehaviorSubject<void>(undefined);
  refresh$ = this.refreshSubject.asObservable();

  show() {
    this.loadingSubject.next(true);
  }

  hide() {
    this.loadingSubject.next(false);
  }

  triggerRefresh() {
    setTimeout(() => {
      this.refreshSubject.next();
    }, 3000);
  }
}