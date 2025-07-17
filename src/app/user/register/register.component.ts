import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  RegisterForm!: FormGroup;
  passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/;

  constructor(private fb: FormBuilder) {
    this.RegisterForm = this.fb.group({
      id: ['0'],
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      firstName: ['', [Validators.required, Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      lastName: ['', [Validators.required, Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      password: ['', [
        Validators.required,
        Validators.pattern(this.passwordRegex)
      ]],
    })
  }

  OnCreateUser() {
    console.log(this.RegisterForm.value)
  }
}
