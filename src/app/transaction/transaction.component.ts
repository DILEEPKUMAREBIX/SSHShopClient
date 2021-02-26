import { Component, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CommonService } from '../services/common.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent {

  TRANSACTIONS: any = [];
  filterTransactions: any = [];
  filter = new FormControl('');

  page = 1;
  pageSize = 5;
  collectionSize = 0;

  constructor(private pipe: DecimalPipe, private service: CommonService, private router: Router
    , private spinner: NgxSpinnerService) {
    // this.filter.valueChanges.pipe(
    //   startWith(''),
    //   map(text => this.search(text))
    // );

    this.filter.valueChanges.subscribe(val => {
      this.search(val)
    });
  }

  search(text: string) {
    if (text == '') {
      this.filterTransactions = this.TRANSACTIONS;
      console.log(this.filterTransactions)
    }
    this.filterTransactions = this.TRANSACTIONS.filter(transaction => {
      return this.pipe.transform(transaction.transactioId).includes(text.toLowerCase())
    });
    console.log(this.filterTransactions);

    this.collectionSize = this.filterTransactions.length;
    // this.refreshCountries();
  }

  items
  ngOnInit() {
    this.loadAllTransactions();
    this.getItems();
  }

  getItems() {
    this.spinner.show();
    this.service.getItems().subscribe(
        (data: any) => {
            this.items = data;
            this.service.items = this.items;
            this.items.forEach(element => {
                element['text'] = element['name'] + ' - ' + element['company'] + ' - ' + element['modelnumber'];
            });
            console.log(this.items);
            this.spinner.hide();
        },
        (error: any) => {

        }
    )
}

  loadAllTransactions() {
    this.spinner.show();
    this.service.getTransactions().subscribe(
      (data: any) => {
        this.TRANSACTIONS = data;
        this.filterTransactions = this.TRANSACTIONS;
        this.collectionSize = this.filterTransactions.length;
        this.spinner.hide();
        // this.refreshCountries();
      },
      (error: any) => {

      }
    )
  }

  getName(id:any) {
    if (this.items && this.items.length > 0) {
      let fitems = this.items.filter(item => item.id == id);
      if (fitems && fitems.length > 0) {
        return [0]['text'];
      }
    }
    return '';
    
  }

  onDelete(transactionId) {
    this.spinner.show();
    this.service.deleteTransactionByTransactionId(transactionId).subscribe(
      (data: any) => {
        this.loadAllTransactions();
        this.spinner.hide();
      },
      (error: any) => {

      }
    )
  }

  routeToInvoice(tranId) {
    this.router.navigateByUrl('/invoice/' + tranId);
  }

  // refreshCountries() {
  //   this.filterTransactions = this.filterTransactions
  //     .map((country, i) => ({id: i + 1, ...country}))
  //     .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  // }


}
