import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterModule } from '@angular/router';
import { EthcontractService } from '../ethcontract.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule, MatTableModule} from '@angular/material';

import { QA } from './qalist';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
    id: any;
    score: any;
    qandalist: any;
    answer: QA[];
    transaction: any;
    userinforesult: any;
    public showInfo: boolean = false;
    public showTest: boolean = false;
    displayedColumns: string[] = ['question', 'choice1', 'choice2', 'choice3', 'choice4'];

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private ethcontractservice: EthcontractService,
    ) {
    }
    ngOnInit() {

    }
    jsonstringify(data) {
        // console.log(data)
        return JSON.stringify(data);
    }
    changeView(viewData) {
        if (viewData === 'result') {
            // this.getUserResult(localStorage.getItem('id'));
            this.showInfo = true;
            this.showTest = false;
            console.log(localStorage.getItem('id'));
            const formdata = {
                'id': localStorage.getItem('id')
            };
            this.ethcontractservice.getuserinfo(formdata).then(
                data => {
                    console.log(data[0]);
                    this.userinforesult = data[0][0];
                this.ethcontractservice.getresult(formdata).then(
                    scoredata => {
                        console.log(scoredata);
                    if (scoredata[1]) {
                        this.userinforesult.score = scoredata[0];
                        console.log(this.userinforesult);
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
          } else if (viewData === 'taketest') {
              this.takeTest();
              this.showInfo = false;
              this.showTest = true;
        }
    }
    getUserResult(id) {
        console.log(id);
        const formdata = {
            'id': id
        };
        this.ethcontractservice.getresult(formdata).then(
            data => {
                console.log(data);
                if (data[1]) {
                    document.getElementById('userresult').innerHTML = data[0];
                } else {
                    document.getElementById('userresult').innerHTML = 'Test not given yet!!!';
                }
            },
            error => {
                const errorResponse = error.json();
            });
    }
    takeTest() {
        this.ethcontractservice.taketest().then(
            data => {
                this.qandalist = data;
                console.log(data);
                const arrayData = [];
                for (const k of Object.keys( data)) {
                    arrayData.push({
                        'id': Number(data[k].id),
                        'answer': data[k].answer
                        });
                 }
                this.answer = arrayData;
                console.log(this.answer);
            },
            error => {
                console.log(error);
                const errorResponse = error.json();
            });
    }
    checkAnswer() {
        let score = 0;
        for (const k of Object.keys(this.answer)) {
            const name = 'answer' + this.answer[k].id ;
            const data = document.getElementsByName(name);
            for (let i = 0 ; i < 4; i++) {
                if ((<HTMLInputElement>data[i]).checked && this.answer[k].answer === (i + 1)) {
                    score += 1;
                }
            }
        }
        const formdata = {
            'id': localStorage.getItem('id'),
            'score': score
        };
        this.ethcontractservice.submittest(formdata).then(
            data => {
                this.transaction = data;
                console.log(data);
                if (data['tx']) {
                    window.location.reload();
        alert(score);

                } else {
                    console.error(data);
                }
            },
            error => {
                console.log(error);
                const errorResponse = error.json();
            });
    }
}
