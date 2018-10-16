import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { Http, HttpModule } from '@angular/http';
import { ChartsModule } from 'ng2-charts';
import { NgxSpinnerModule } from 'ngx-spinner';
// import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { AppRoutingModule } from './/app-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import {EthcontractService} from './ethcontract.service';

@NgModule({
	declarations: [
		AppComponent,
		UserComponent,
		AdminComponent,
		HomeComponent,
		NavbarComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		ChartsModule,
		FormsModule,
		HttpModule,
		NgbModule.forRoot(),
		SimpleNotificationsModule.forRoot(),
		// Ng4LoadingSpinnerModule.forRoot(),
		AppRoutingModule,
		NgxSpinnerModule.forRoot()
	],
	providers: [EthcontractService],
	bootstrap: [AppComponent]
})
export class AppModule { }
