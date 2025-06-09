import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  constructor(private router:Router){}

  isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  navigatetodashboard(){
    this.router.navigate(['/expense/dashboard'])
  }
  navigatetoRecurring(){
    this.router.navigate(['/expense/recurring'])
  }
  navigatetostats(){
  this.router.navigate(['/expense/stats'])
  }
  navigatetosettings(){
  this.router.navigate(['/expense/settings'])
  }
}
