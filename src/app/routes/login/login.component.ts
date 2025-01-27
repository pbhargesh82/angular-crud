import { MessageService } from 'primeng/api';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DarkModeService } from '@services/dark-mode.service';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, IconFieldModule, InputIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private fb: FormBuilder = inject(FormBuilder);
  private messageService: MessageService = inject(MessageService);
  loginForm: FormGroup;
  darkModeService: DarkModeService = inject(DarkModeService);
  isRegister: boolean = false;
  registerFields: string[] = ['firstName', 'lastName', 'confirmPassword', 'receiveEmails'];

  constructor(
    private router: Router
  ) {
    /* 
      Disabled register form by for now, can be enabled in the future.
    */
    this.loginForm = this.fb.group({
      // firstName: ['', Validators.required],
      // lastName: ['', Validators.required],
      email: ['test@123.com', [Validators.required, Validators.email]],
      password: ['test@123.com', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      // confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      // receiveEmails: [false],
    });
  }

  ngOnInit(): void {
  }

  toggleDarkMode(): void {
    this.darkModeService.updateDarkMode(!this.darkModeService.getDarkMode);
  }

  onCheckboxChange(event: any): void {
    this.loginForm.patchValue({ 'receiveEmails': event.target.checked });
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
    const email = this.email?.value;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email && !emailPattern.test(email)) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please enter a valid email address.' });
      return;
    }

    const password = this.password?.value;
    if (password && password.length < 8) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Password must be at least 8 characters long.' });
      return
    }
    if (password && password.length > 16) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Password must be at most 16 characters long.' });
      return
    }

    if (this.loginForm.valid) {
      console.log('Form Submitted:', this.loginForm.value);
      if (this.isRegister) {
        this.isRegister = false;
      } else {
        this.router.navigate(['/dashboard'], { queryParams: { showIntro: true } });
      }
    }
  }


}
