import { Component } from '@angular/core';
import { LoadingService } from './Service/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Expense_Tracker';
  isLoading: boolean = false;
  constructor(private loadingService: LoadingService) {}

   ngOnInit() {
    this.loadingService.loading$.subscribe(status => {
      this.isLoading = status;
    });
  }
}
