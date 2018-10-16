import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterModule } from '@angular/router';
import { EthcontractService } from '../ethcontract.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
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
    }
    jsonstringify(data) {
        // console.log(data)
        return JSON.stringify(data);
    }
    changeView(viewData) {
        if (viewData === 'result') {
            this.getUserResult(localStorage.getItem('id'));
       // $scope.showUser = true;
       // $scope.showQandA = false;
          } else if (viewData === 'taketest') {
              this.takeTest();
         //   $scope.showUser = false;
         //   $scope.showQandA = true;
        }
    }
    getUserResult(id) {
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
