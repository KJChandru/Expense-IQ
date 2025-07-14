import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, RequiredValidator, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  LoginForm !:FormGroup

  constructor(private fb:FormBuilder){
    this.LoginForm= this.fb.group({
      'UserName': [null,Validators.required],
      'password':[null,Validators.required]
    })
  }
LoginUser(){
  console.log(this.LoginForm.value)
}


}
