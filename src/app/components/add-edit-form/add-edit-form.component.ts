import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenderOptions, StatusOptions } from '@config/constants';
import { Options, Person } from '@config/model';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-edit-form',
  imports: [ReactiveFormsModule, ButtonModule, DividerModule, Select, DatePickerModule, CommonModule],
  templateUrl: './add-edit-form.component.html',
  styleUrl: './add-edit-form.component.scss'
})
export class AddEditFormComponent {

  private fb: FormBuilder = inject(FormBuilder);
  personFrom: FormGroup;
  @Input() selectedPerson: Person | null = null;
  @Output() closeEventEmitter: EventEmitter<boolean> = new EventEmitter();
  @Output() saveEventEmitter: EventEmitter<FormGroup> = new EventEmitter();
  genderOptions: Options[] = GenderOptions;
  statusOptions: Options[] = StatusOptions;

  constructor() {
    this.personFrom = this.fb.group({
      id: [''],
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      phone: [''],
      birthdate: [''],
      bio: [''],
      company: [''],
      jobType: [''],
      status: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.selectedPerson) {
      this.personFrom.reset();
      this.personFrom.patchValue(this.selectedPerson);
    }
  }

  onSave() {
    this.saveEventEmitter.emit(this.personFrom);
  }

  onClose() {
    this.closeEventEmitter.emit();
  }

}
