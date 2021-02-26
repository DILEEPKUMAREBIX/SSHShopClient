import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../services/common.service';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'gas-billing',
    templateUrl: './billing.component.html',
    styleUrls: ['./billing.component.css']
})
export class BillingComponent {
    actualValue: number = 0;
    totalValue: number = 0;
    gstValue: number = 0;
    items: any = [];
    cartItems: any = [];
    selectedItem;
    selectedItemObj;
    quantity;
    gst = 12;
    submitBtnTxt: any = 'Add to Cart';
    customer: any;
    customers: any = [];
    filteredItems: any = [];
    costOfItem

    constructor(private router: Router, private formBuilder: FormBuilder,
        private service: CommonService, private spinner: NgxSpinnerService,
        private toastr: ToastrService) {
    }

    routeToHome() {
        console.log("home");
        this.router.navigate(['my-home']);
    }

    handleChange(data) {
        if (data) {
            this.selectedItem = data;
            this.selectedItemObj = this.items.filter(item => item.id == data)[0]
            this.costOfItem = this.selectedItemObj.totalPrice;
        }
    }

    ngOnInit() {
        this.getItems();
    }

    getItems() {
        this.spinner.show();
        this.service.getItems().subscribe(
            (data: any) => {
                this.items = data;
                this.service.items = this.items;
                this.items.forEach(element => {
                    element['text'] = element['name'] + ' - ' + element['company'] + ' - ' + element['modelnumber'] + ' - ' + element['code'];
                });
                console.log(this.items);
                this.spinner.hide();
            },
            (error: any) => {

            }
        )
    }

    addToCart() {
        let errors: any = [];
        if (this.selectedItem == null) {
            this.toastr.error('Please select Item', 'Error');
            return;
        }

        if (this.quantity == '' || this.quantity == null || this.quantity == undefined) {
            // let error = { severity: 'error', summary: 'Error Message', detail: 'Please enter quantity' }
            // errors.push(error);
            this.toastr.error('Please enter Quantity', 'Error');
            return;
        }


        if (this.costOfItem == '' || this.costOfItem == null || this.costOfItem == undefined) {
            // let error = { severity: 'error', summary: 'Error Message', detail: 'Please enter cost' }
            // errors.push(error);
            this.toastr.error('Please enter cost', 'Error');
            return;
        }

        let total = this.quantity * this.costOfItem;
        var obj = {
            'quantity': this.quantity
            , 'cost': this.costOfItem
            , 'name': this.selectedItemObj.name + '   :   ' + this.quantity + ' * ' + this.costOfItem
            , 'value': total
            , 'selectedItem': this.selectedItem
        }
        if (this.submitBtnTxt !== 'Update') {
            this.cartItems.push(obj);
        } else {
            this.cartItems = [];
            this.cartItems.push(obj);
        }
        this.calculateGST();
        this.quantity = 0;
        this.selectedItem = 0;
        this.costOfItem = 0;
    }

    calculateGST() {
        this.actualValue = 0;
        for (let i = 0; i < this.cartItems.length; i++) {
            this.actualValue += this.cartItems[i].value;
        }

        this.gstValue = (this.actualValue * 0) / 100;
        this.totalValue = this.actualValue + this.gstValue;
    }

    editItem(item: any) {
        this.submitBtnTxt = 'Update';
        let arr: any = [];
        arr = item.name.split(' *');
        this.selectedItem = item.selectedItem;
        this.quantity = item.quantity;
        this.costOfItem = item.cost;
    }

    search(event) {
        this.filteredItems = this.items;
        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            if (item.name.toLowerCase().indexOf(event.query.toLowerCase()) > -1) {
                this.filteredItems.push(item);
            }
        }
    }

    reset() {
        this.cartItems = [];
        this.totalValue = 0;
        this.quantity = 0;
        this.selectedItem = 0;
        this.costOfItem = 0;
    }

    submit() {
        this.spinner.show();
        this.service.getLatestTransaction().subscribe(
            (data: any) => {
                let transactions: any = [];
                this.cartItems.forEach(element => {
                    let transaction = {
                        transactioId: data == null ? 1 : data.transactioId + 1,
                        itemId: +element.selectedItem,
                        quantity: element.quantity,
                        price: element.cost,
                        totalTransactionPrice: this.totalValue
                    };
                    transactions.push(transaction);
                });

                this.service.saveTransactions(transactions).subscribe(
                    (data: any) => {
                        this.cartItems = [];
                        this.totalValue = 0;
                        this.quantity = 0;
                        this.selectedItem = 0;
                        this.costOfItem = 0;
                        this.spinner.hide();
                        this.toastr.success('Bill Generated', 'Success');
                        this.router.navigateByUrl('/invoice/' + data[0]['transactioId']);
                    }
                )
            }
        )
    }
}