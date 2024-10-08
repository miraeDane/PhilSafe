import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {


  loading: boolean = false;
  private loadingSubscription: Subscription | undefined;

  constructor(
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.router.events
      .pipe(
        filter(
          (event) =>
            event instanceof NavigationStart ||
            event instanceof NavigationEnd ||
            event instanceof NavigationCancel ||
            event instanceof NavigationError
        )
      )
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.loadingService.show();
        } else {
          this.loadingService.hide();
        }
      });

    this.loadingSubscription = this.loadingService.loading$.subscribe(loading => {
      this.loading = loading;
      this.changeDetectorRef.detectChanges();
    });
  }
  navigateToReport() {
    this.router.navigate(['/tabs/report-as']); 
  }

}
