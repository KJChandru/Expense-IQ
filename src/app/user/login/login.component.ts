import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, RequiredValidator, Validators } from '@angular/forms';
import { UserService } from '../Service/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  LoginForm !:FormGroup

  constructor(private fb:FormBuilder, private userService:UserService,private toasterService:ToastrService,private route:Router){
    this.LoginForm= this.fb.group({
      'UserName': [null,Validators.required],
      'password':[null,Validators.required]
    })
  }
LoginUser(){
  
  this.userService.loginUser(this.LoginForm.value).subscribe(
    res=>{
      // Use strict equality for comparison
      if(res?.result?.Out === 1){
        this.toasterService.success(res.result.Message, 'Success')
        this.route.navigate(['/expense/dashboard']);
      }
       else if (res.result.Out === -1 && res.result.Error?.length) {
      this.toasterService.error(res.result.Error[0].errorMsg, 'Error');
    }
    },
    err=>{
      const apiErrorMsg =  err?.Error?.errorMsg || err?.error?.message;
    if (apiErrorMsg) {
      this.toasterService.error(apiErrorMsg, 'Error');
    } else {
      this.toasterService.error('Server error. Please try again later.', 'Error');
    }
    }
  )
}


}
