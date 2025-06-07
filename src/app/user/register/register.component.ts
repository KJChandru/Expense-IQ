import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  userForm!:FormGroup;
  passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/;

constructor(private fb:FormBuilder){
  this.userForm=this.fb.group({
    id:['0'],
    username:['',[Validators.required,Validators.minLength(4),Validators.maxLength(20)]],
    firstName:['',[Validators.required,Validators.required,Validators.minLength(3),Validators.maxLength(20)]],
    lastName:['',[Validators.required,Validators.required,Validators.minLength(3),Validators.maxLength(20)]],
    password: ['', [
        Validators.required,
        Validators.pattern(this.passwordRegex)
      ]],
    profile: ['',Validators.required]
  })
}
imageupload(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input?.files?.length) {
    const file = input.files[0];
    this.userForm.get('profile')?.setValue(file);

    const reader = new FileReader();
   
    reader.readAsDataURL(file);
  }
}
OnCreateUser(){
console.log(this.userForm)
}
}
