import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { EthcontractService } from '../ethcontract.service';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    id: any;
    password: any;
    uname: any;
    email: any;
    routerurl: any;
    constructor(
        private modalService: NgbModal,
        private router: Router,
        private ethcontractservice: EthcontractService,
    ) {
        // router.events.subscribe((val) => {
        //     // see also 
        //     console.log(val)
        // });
    }

    ngOnInit() {
        localStorage.setItem('address', '0');
        localStorage.setItem('token', '0');
    }
    openVerticallyCentered(content) {
        this.modalService.open(content, { centered: true });
    }
    UserLogin() {
        const formdata = {
            'id': this.id,
            'password': this.password
        };
        this.ethcontractservice.userlogin(formdata).then(
            data => {
                console.log(data);
                if (data['token']) {
                    localStorage.setItem('token', data['token']);
                    this.routerurl = '/user';
                    this.router.navigate([this.routerurl]);
                }
            },
            error => {
                console.log(error);
            });
    }

    AdminLogin() {
        const formdata = {
            'id': this.id,
            'password': this.password
        };
        this.ethcontractservice.adminlogin(formdata).then(
            data => {
                console.log(data);
                if (data['token']) {
                    localStorage.setItem('token', data['token']);
                    this.routerurl = '/admin';
                    this.router.navigate([this.routerurl]);
                }
            },
            error => {
                console.log(error);
            });
    }
    RegisterUser(){
        const formdata = {
            'uname': this.uname,
            'email': this.email,
            'password': this.password
        };
        this.ethcontractservice.registeruser(formdata).then(
            data => {
                if (data['error'] === 0) {
                    alert("User ID :"+ data["id"]);
                    this.routerurl = '/home';
                    this.router.navigate([this.routerurl]);
                    window.location.reload();

                }
            },
            error => {
                console.log(error);
            });
    }
}
