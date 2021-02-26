import { DecimalPipe } from '@angular/common';
import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../services/common.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  ITEMS: any = [];
  filterItems: any = [];
  isLoading = false;
  filter = new FormControl('');

  page = 1;
  pageSize = 5;
  collectionSize = 0;
  itemObj

  constructor(private pipe: DecimalPipe, private service: CommonService, private router: Router,
    private modalService: NgbModal, private spinner: NgxSpinnerService, private toastr: ToastrService) {
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
      this.filterItems = this.ITEMS;
      console.log(this.filterItems)
    }
    this.filterItems = this.ITEMS.filter(item => {
      return item.name.toLowerCase().includes(text.toLowerCase())
      || item.company.toLowerCase().includes(text.toLowerCase())
      || item.modelnumber.toLowerCase().includes(text.toLowerCase())
      || item.code.toLowerCase().includes(text.toLowerCase())
      || item.price.toString().toLowerCase().includes(text.toLowerCase())
    });
    console.log(this.filterItems);

    this.collectionSize = this.filterItems.length;
    // this.refreshItems();
  }

  closeResult = '';
  type = 'new';
  open(content, type, item) {
    this.type = type;
    if (type == 'new') {
      this.itemObj = {
        "shopNumber": 1,
        "name": "",
        "company": "",
        "modelnumber": "",
        "warranty": "",
        "code": "",
        "price": 0,
        "gst": 0,
        "totalPrice": 0
      }
    } else {
      this.itemObj = item;
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnInit() {
    this.loadAllItems();
  }

  loadAllItems() {
    this.spinner.show();
    this.service.getItems().subscribe(
      (data: any) => {
        this.ITEMS = data;
        this.filterItems = this.ITEMS;
        this.collectionSize = this.filterItems.length;
        // this.refreshItems();
        this.service.items = data;
        this.spinner.hide();
      },
      (error: any) => {

      }
    )
  }

  onDelete(transactionId) {
    this.spinner.show();
    this.service.deleteItem(transactionId).subscribe(
      (data: any) => {
        this.spinner.hide();
        this.toastr.success('Item Deleted Successfully', 'Success');
        this.loadAllItems();
      },
      (error: any) => {

      }
    )
  }

  routeToInvoice(tranId) {
    this.router.navigateByUrl('/invoice/' + tranId);
  }

  // refreshItems() {
  //   this.filterItems = this.filterItems
  //     .map((country, i) => ({ id: i + 1, ...country }))
  //     .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  // }

  saveOrUpdate() {
    
    if(this.itemObj['name'] == undefined || this.itemObj['name'].length == 0) {
      this.toastr.error('Please enter Name', 'Error');
    }

    if(this.itemObj['company'] == undefined || this.itemObj['company'].length == 0) {
      this.toastr.error('Please enter Company', 'Error');
    }

    if(this.itemObj['price'] == undefined || this.itemObj['price'].length == 0) {
      this.toastr.error('Please enter Price', 'Error');
    }

    this.spinner.show();
    console.log(this.itemObj)
    this.itemObj['totalPrice'] = +this.itemObj['price'] + (+this.itemObj['price']*+this.itemObj['gst']/100);
    console.log(this.itemObj)
    this.service.saveItem(this.itemObj).subscribe(
      (data: any) => {
        this.toastr.success('Item Created Successfully', 'Success');
        this.modalService.dismissAll();
        this.loadAllItems();
        this.spinner.hide();
      },
      (error: any) => {

      }
    )
  }

}
