import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, IonicSlides } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SignatureModalComponent } from './signature-modal/signature-modal.component';
import { CookieService } from 'ngx-cookie-service';
import { MinuteSecondsPipe } from './pipes/minute-seconds.pipe';



@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    HttpClientModule,
    SignatureModalComponent,
    MinuteSecondsPipe,
    
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    CookieService
  ],
  bootstrap: [AppComponent],
 
})
export class AppModule {}
