import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent {
  @Input() type : 'success' | 'error' | 'warning' | 'info' = 'info';
  @Input() title : string ='';
  @Input() message : string ='';

  @Output() confirm = new EventEmitter<boolean>();
  @Output() cancel = new EventEmitter<boolean>();  
  isVisible: boolean = false;

  onConfirm() {
    this.confirm.emit(true);
    this.close();
  }
  close() {
    this.isVisible = false;
  }

  onCancel() {
    this.confirm.emit(false);
    this.close();
  }

  open() {
    this.isVisible = true;
  }
 getIcon(type: string): string {
  switch (type) {
    case 'delete': return 'delete_outline';
    case 'warning': return 'warning_amber';
    case 'success': return 'check_circle_outline';
    case 'info': return 'info';
    default: return 'help_outline';
  }
}


}
