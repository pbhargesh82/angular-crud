import { TableConfig } from "./model";

export const peopleTableConfig: TableConfig = {
    columns: [
        { field: 'fullName', header: 'Person', filter: true, sort: true, globalFilter: true, width: '300px' },
        { field: 'email', header: 'Email', filter: true, sort: true, globalFilter: true },
        { field: 'gender', header: 'Gender', filter: true, sort: true, globalFilter: false },
        { field: 'phone', header: 'Phone', filter: true, sort: true, globalFilter: false },
        { field: 'birthdate', header: 'Birth Date', filter: true, sort: true, globalFilter: false },
        { field: 'bio', header: 'Bio', filter: true, sort: true, globalFilter: false, width: '300px' },
        { field: 'company', header: 'Company', filter: true, sort: true, globalFilter: false, width: '300px' },
        { field: 'jobType', header: 'Job Type', filter: true, sort: true, globalFilter: false },
        { field: 'status', header: 'Status', filter: true, sort: true, globalFilter: false },
        { field: 'action', header: 'Action', filter: false, sort: false, globalFilter: false, width: '150px' },
    ],
};
