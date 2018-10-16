import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { EthcontractService } from '../ethcontract.service';


@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    show: boolean = false;
    adminshow: boolean = false;
    usershow: boolean = false;
    homeshow: boolean = false;
    balance: any;
    id: any;
    password: any;
    uname: any;
    email: any;
    routerurl: any;
    userinforesult: any;
    constructor(
        private router: Router,
        private modalService: NgbModal,
        private ethcontractservice: EthcontractService,
    ) {
    }

    ngOnInit() {
        this.adminshow = false;
        this.usershow = false;
        this.homeshow = false;

        if (this.router.url === '/admin') {
            this.adminshow = true;
            this.usershow = false;
            this.homeshow = false;
            const formdata = {
            };
            this.ethcontractservice.getaccountbalance().then(
                data => {
                    console.log(data);
                    this.balance = data;
                },
                error => {
                    const errorResponse = error.json();
                });
        } else if (this.router.url === '/user') {
            this.adminshow = false;
            this.usershow = true;
            this.homeshow = false;
            const formdata = {
                'id': localStorage.getItem('id')
            };
            this.ethcontractservice.getuserinfo(formdata).then(
                data=>{
                    console.log(data[0]);
                    this.userinforesult = data[0][0];
                this.ethcontractservice.getresult(formdata).then(
                    data => {
                        console.log(data);
                    if (data[1]) {
                        this.userinforesult.score = data[0];
                    console.log(this.userinforesult)

                    } else {
                        this.userinforesult.score = 'Test not given yet!!!';
                    }
                    },
                    error => {
                        const errorResponse = error.json();
                    });
                },
                error => {
                    const errorResponse = error.json();

                }
                
            );
            
        } else {
            this.adminshow = false;
            this.usershow = false;
            this.homeshow = true;
        }
    }

    toggleCollapse() {
        this.show = !this.show;
        // this.collapse = this.collapse == "open" ? 'closed' : 'open';
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
                    localStorage.setItem('id', formdata.id);
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
                if (data['result'] === true) {
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
