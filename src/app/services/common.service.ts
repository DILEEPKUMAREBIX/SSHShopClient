import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    })
  };

  items: any;
  constructor(private http: HttpClient) { }

  getItems() {
    return this.http.get(environment.apiUrl + 'items', this.httpOptions);
  }

  saveItem(item: any) {
    return this.http.post(environment.apiUrl + 'item', item, this.httpOptions);
  }

  deleteItem(itemId) {
    return this.http.delete(environment.apiUrl + 'item/' + itemId, this.httpOptions);
  }

  getTransactions() {
    return this.http.get(environment.apiUrl + 'transactions', this.httpOptions);
  }

  saveTransaction(transaction: any) {
    return this.http.post(environment.apiUrl + 'transaction', transaction, this.httpOptions);
  }

  saveTransactions(transactions: any) {
    return this.http.post(environment.apiUrl + 'saveTransactions', transactions, this.httpOptions);
  }

  getLatestTransaction() {
    return this.http.get(environment.apiUrl + 'last-transaction', this.httpOptions);
  }

  getTransactionItems(tranId) {
    return this.http.get(environment.apiUrl + 'transactions/tranId/'+ tranId , this.httpOptions);
  }

  deleteTransactionByTransactionId(transactionId) {
    return this.http.delete(environment.apiUrl + 'transaction/tranId/' + transactionId, this.httpOptions);
  }
}
