import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Configration } from './web-config';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
    providedIn: 'root'
})
export class EthcontractService {

    private web3Provider: null;
    private contracts: {};
    constructor(
        private http: Http,
        private spinner: NgxSpinnerService,
    ) { }

    showLoader() {
        this.spinner.show();
    }
    hideLoader() {
        this.spinner.hide();
    }
    adminlogin(payload) {
        this.showLoader();
        return new Promise((resolve, reject) => {
            return this.http.post(Configration.adminurl + 'adminLogin', payload)
                .subscribe((success: any) => {
                    this.hideLoader();
                    return resolve(success.json());
                }, (error) => {
                    this.hideLoader();
                    console.log(error);
                });
        });
    }
    getaccountbalance() {
        this.showLoader();
        return new Promise((resolve, reject) => {
            return this.http.get(Configration.adminurl + 'getAccountBalance')
                .subscribe((success: any) => {
                    this.hideLoader();
                    return resolve(success.json());
                }, (error) => {
                    console.log(error);
                    this.hideLoader();
                });
        });
    }
    registeruser(payload) {
        this.showLoader();
        return new Promise((resolve, reject) => {
            return this.http.post(Configration.adminurl + 'register', payload)
                .subscribe((success: any) => {
                    this.hideLoader();
                    return resolve(success.json());
                }, (error) => {
                    this.hideLoader();
                    console.log(error);
                });
        });
    }
    userlogin(payload) {
        this.showLoader();
        return new Promise((resolve, reject) => {
            console.log(payload);
            return this.http.post(Configration.adminurl + 'login', payload)
                .subscribe((success: any) => {
                    this.hideLoader();
                    return resolve(success.json());
                }, (error) => {
                    this.hideLoader();
                    console.log(error);
                });
        });
    }
    getuserinfo(payload) {
        this.showLoader();
        return new Promise((resolve, reject) => {
            console.log(payload);
            return this.http.post(Configration.adminurl + 'userinfo', payload)
                .subscribe((success: any) => {
                    this.hideLoader();
                    return resolve(success.json());
                }, (error) => {
                    this.hideLoader();
                    console.log(error);
                });
        });
    }
    getuserslist(payload) {
        this.showLoader();
        return new Promise((resolve, reject) => {
            return this.http.post(Configration.adminurl + 'usersList', payload)
                .subscribe((success: any) => {
                    this.hideLoader();
                    return resolve(success.json());
                }, (error) => {
                    this.hideLoader();
                    console.log(error);
                });
        });
    }

    taketest() {
        this.showLoader();
        return new Promise((resolve, reject) => {
            return this.http.get(Configration.adminurl + 'taketest')
                .subscribe((success: any) => {
                    this.hideLoader();
                    return resolve(success.json());
                }, (error) => {
                    this.hideLoader();
                    console.log(error);
                });
        });
    }

    getqanda(payload) {
        this.showLoader();
        return new Promise((resolve, reject) => {
            return this.http.post(Configration.adminurl + 'qanda', payload)
                .subscribe((success: any) => {
                    this.hideLoader();
                    return resolve(success.json());
                }, (error) => {
                    this.hideLoader();
                    console.log(error);
                });
        });
    }
    submittest(payload) {
        this.showLoader();
        return new Promise((resolve, reject) => {
            return this.http.post(Configration.adminurl + 'updateUserResult', payload)
                .subscribe((success: any) => {
                    this.hideLoader();
                    return resolve(success.json());
                }, (error) => {
                    this.hideLoader();
                    console.log(error);
                });
        });
    }
    getresult(payload) {
        this.showLoader();
        return new Promise((resolve, reject) => {
            return this.http.post(Configration.adminurl + 'getUserResult', payload)
                .subscribe((success: any) => {
                    this.hideLoader();
                    return resolve(success.json());
                }, (error) => {
                    this.hideLoader();
                    console.log(error);
                });
        });
    }
}
