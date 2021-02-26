import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  transactionId: any;
  tranItems: any = [];
  items: any = [];
  constructor(private activatedRouter: ActivatedRoute,
    private service: CommonService,
    private router: Router,
    private spinner: NgxSpinnerService) {
    this.activatedRouter.params.subscribe(
      (params: any) => {
        console.log(params['id']);
        this.transactionId = params['id'];
        this.loadTransactionItems();
      }
    );
  }

  tranId;
  createdAt;
  totalTransactionPrice;
  totalTaxableValue;
  totalGSGAmoount;
  loadTransactionItems() {
    this.spinner.show();
    this.totalTaxableValue = 0;
    this.totalGSGAmoount = 0;
    this.service.getTransactionItems(this.transactionId).subscribe(
      (data: any) => {
        this.tranItems = data;
        this.tranItems.forEach(item => {
          item['taxableValue'] = ((item.price / 118) * 100);
          item['gstAmount'] = ((item.price - ((item.price / 118) * 100)) / 2);
          this.totalGSGAmoount += (item['gstAmount'] *2);
          this.totalTaxableValue += item['taxableValue'];
        });
        this.tranId = this.tranItems[0]['transactioId'];
        this.createdAt = this.tranItems[0]['createdAt'];
        this.totalTransactionPrice = this.tranItems[0]['totalTransactionPrice']
        this.spinner.hide();
      }
    )
  }

  ngOnInit(): void {
    this.getItems();
  }

  getItems() {
    if (this.service.items != null && this.service.items != undefined) {
      this.items = this.service.items
    } else {
      this.service.getItems().subscribe(
        (data: any) => {
          this.items = data;
          this.service.items = this.items;
        },
        (error: any) => {

        }
      )
    }
  }

  getItemName(itemId) {
    if (this.items && this.items.length > 0) {
      let item = this.items.filter((item:any) => item.id == itemId)[0]
      return item.name + ' - ' + item.company + ' - ' + item.modelnumber;
    }
    return '';
  }

  printPage() {
    window.print();
  }

  navigateToPage(page) {
    this.router.navigateByUrl('/' + page);
  }

}
