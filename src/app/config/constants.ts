import { Options } from "./model";

export const fieldLabelMap: { [key: string]: string } = {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    gender: 'Gender',
    // phone: 'Phone Number',
    // birthdate: 'Birth Date',
    // bio: 'Biography',
    // company: 'Company',
    // jobType: 'Job Type',
    status: 'Status',
};

export const GenderOptions: Options[] = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
];

export const StatusOptions: Options[] = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Pending', value: 'pending' },
];