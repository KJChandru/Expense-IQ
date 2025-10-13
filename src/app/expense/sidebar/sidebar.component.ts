import { Component, TemplateRef, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
    private currentViewRef: any;
  constructor(private router: Router,private viewContainerRef: ViewContainerRef) { }

  isActive(path: string): boolean {
    return this.router.url.includes(path);
  }
  openLogoutPopup(template: TemplateRef<any>) {
    this.currentViewRef = this.viewContainerRef.createEmbeddedView(template);
  }

  closePopup() {
    if (this.currentViewRef) {
      this.currentViewRef.destroy();
    }
  }

  confirmLogout() {
    this.closePopup();
    // this.authService.logoutUser();
  }
}
