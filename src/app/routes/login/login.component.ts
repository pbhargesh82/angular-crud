import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {DarkModeService} from '@services/dark-mode.service';
import {ButtonModule} from 'primeng/button';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {InputTextModule} from 'primeng/inputtext';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, IconFieldModule, InputIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private fb: FormBuilder = inject(FormBuilder);
  loginForm: FormGroup;
  darkModeService: DarkModeService = inject(DarkModeService);
  isRegister: boolean = true;
  registerFields: string[] = ['firstName', 'lastName', 'confirmPassword', 'receiveEmails'];

  constructor(
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      receiveEmails: [false],
    });
  }

  ngOnInit(): void {
  }

  toggleDarkMode(): void {
    this.darkModeService.updateDarkMode(!this.darkModeService.getDarkMode);
  }

  onCheckboxChange(event: any): void {
    this.loginForm.patchValue({'receiveEmails': event.target.checked});
    console.log(this.loginForm.value);
  }

  onRegisterClick(event: Event): void {
    event.preventDefault();
    this.isRegister = !this.isRegister;
    if (this.isRegister) {
      this.loginForm.addControl('firstName', this.fb.control('', [Validators.required]));
      this.loginForm.addControl('lastName', this.fb.control('', [Validators.required]));
      this.loginForm.addControl('confirmPassword', this.fb.control('', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]));
      this.loginForm.addControl('receiveEmails', this.fb.control(false));
    } else {
      this.registerFields.forEach(field => {
        this.loginForm.removeControl(field);
      })
    }
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get confirmPassword() {
    return this.loginForm.get('confirmPassword');
  }

  onSubmit(): void {
    console.log('loginForm: ', this.loginForm.value);
    if (this.loginForm.valid) {
      console.log('Form Submitted:', this.loginForm.value);
      if (this.isRegister) {
        this.isRegister = false;
      } else {
        this.router.navigate(['/dashboard']);
      }
    } else {
      console.log('Form is invalid');
    }
  }


}
