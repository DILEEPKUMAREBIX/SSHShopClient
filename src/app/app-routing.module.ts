import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillingComponent } from './billing/billing.component';
import { HomeComponent } from './home/home.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { ItemComponent } from './item/item.component';
import { TransactionComponent } from './transaction/transaction.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'my-home',
    pathMatch: 'full'
  },
  {
    path: 'my-home',
    component: HomeComponent
  },
  {
    path: 'new-bill',
    component: BillingComponent
  },
  {
    path: 'transactions',
    component: TransactionComponent
  },
  {
    path: 'invoice/:id',
    component: InvoiceComponent
  },
  {
    path: 'items',
    component: ItemComponent
  }
  // {
  //   path: 'gas-customers',
  //   component: CustomersComponent
  // },
  // {
  //   path: 'gas-storage',
  //   component: GasStorageComponent
  // },
  // {
  //   path: 'add-customer',
  //   component: AddCustomersComponent
  // },
  // {
  //   path: 'transactions',
  //   component: TransactionsComponent
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
