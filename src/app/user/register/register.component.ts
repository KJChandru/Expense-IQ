import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserModel } from 'src/app/environment/Model';
import { UserService } from '../Service/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  ReguserDetails!:UserModel
  RegisterForm!: FormGroup;
  passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/;

  constructor(private fb: FormBuilder, private userService:UserService,private toasterService:ToastrService) {
    this.RegisterForm = this.fb.group({
      id: ['0'],
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      firstName: ['', [Validators.required, Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      lastName: ['', [Validators.required, Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      password: ['', [
        Validators.required,
        // Validators.pattern(this.passwordRegex)
      ]],
    })
  }

  OnCreateUser() {
    // this.ReguserDetails.Firstname=this.RegisterForm
    this.ReguserDetails = this.RegisterForm.value;

  this.userService.registerUser(this.ReguserDetails).subscribe(
  (res) => {

    if (res.result.Out === 1) {
      this.toasterService.success(res.result.Message, 'Success');
    } 
    else if (res.result.Out === -1 && res.result.Error?.length) {
      this.toasterService.error(res.result.Error[0].errorMsg, 'Error');
    } 
    else {
      this.toasterService.error('Unexpected response from server.', 'Error');
    }
  },
  (err) => {
    console.error(err);
    const apiErrorMsg = err?.error?.result?.Error?.[0]?.errorMsg;

    if (apiErrorMsg) {
      this.toasterService.error(apiErrorMsg, 'Error');
    } else {
      this.toasterService.error('Server error. Please try again later.', 'Error');
    }
  }
);


  }
}
