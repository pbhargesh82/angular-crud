import {ValidationErrors, Validator} from '@angular/forms';

export interface TableConfig {
  columns: Column[];
}

export interface Column {
  field: string;
  header: string;
  filter: boolean;
  sort: boolean;
  globalFilter: boolean;
  width?: string;
}

export interface Person {
  id?: number;
  firstName: string;
  middleName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phone: string;
  birthdate: Date | string;
  bio: string;
  gender: string;
  // zodiacSign: string;
  company: string;
  // jobTitle: string;
  jobType: string;
  status: string;
  action?: {}[];
}

export interface Options {
  label: string;
  value: string;
}
