import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'my-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
    constructor(private router: Router) { }

    routeToPage(path: any) {
        console.log(path);
        this.router.navigate([path]);
    }
}