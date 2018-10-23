import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterModule } from '@angular/router';
import { EthcontractService } from '../ethcontract.service';
import { User } from './userlist';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
    id: any;
    email: any;
    uname: any;
    result: any;
    userlist: any;
    qandalist: any;
    $scope: any;
    public showUser:boolean = false;
    public showQandA:boolean = false;
    constructor(
        private modalService: NgbModal,
        private router: Router,
        private ethcontractservice: EthcontractService,
    ) {
        localStorage.setItem('useridpointer', 0 + '');
        localStorage.setItem('qandapointer', 0 + '');
        // router.events.subscribe((val) => {
        //     // see also 
        //     console.log(val)
        // });
    }
    userDisplayedColumns: string[] = ['id', 'uname', 'email', 'result', 'getdetails' ];
    questionDisplayedColumns: string[] = ['id', 'question', 'choice1', 'choice2', 'choice3', 'choice4', 'answer', 'is_active'];


    ngOnInit() {
    }

    jsonstringify(data) {
        // console.log(data)
        return JSON.stringify(data);
    }
    getMoreUser() {
        localStorage.setItem('useridpointer', (Number(localStorage.getItem('useridpointer')) + 10 ) + '');
        this.getUserList();
    }
    getMoreQandA() {
        localStorage.setItem('qandapointer', (Number(localStorage.getItem('qandapointer')) + 10 ) + '');
        this.getQandA();
    }
    changeView(viewData) {
        if (viewData === 'user') {
            this.getUserList();
            this.showUser = true;
            this.showQandA = false;
          } else if (viewData === 'qanda') {
              this.getQandA();
              this.showUser = false;
              this.showQandA = true;
        }
    }
    getUserList() {
        const formdata = {
            'userIdPointer': Number(localStorage.getItem('useridpointer'))
        };
        this.ethcontractservice.getuserslist(formdata).then(
            data => {
                console.log(data);
                this.userlist = data;
            },
            error => {
                console.log(error);
                const errorResponse = error.json();
            });
    }
    getUserResult(userIns) {
        const formdata = {
            'id': userIns.id
        };
        this.ethcontractservice.getresult(formdata).then(
            data => {
                console.log(data);
                if (data[1]) {
                    document.getElementById(userIns.id).innerHTML = data[0];
                } else {
                    userIns.result = 'Test not given yet!!!';
                    document.getElementById(userIns.id).innerHTML = 'Test not given yet!!!';
                }
            },
            error => {
                const errorResponse = error.json();
            });
    }
    getQandA() {
        const formdata = {
            'qandapointer': Number(localStorage.getItem('qandapointer'))
        };
        this.ethcontractservice.getqanda(formdata).then(
            data => {
                console.log(data);
                this.qandalist = data;
            },
            error => {
                console.log(error);
                const errorResponse = error.json();
            });
    }
}
