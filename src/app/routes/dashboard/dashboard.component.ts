import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { storeName } from '@config/db.config';
import { Person } from '@config/model';
import { peopleTableConfig } from '@config/table.config';
import { generatePeopleData } from '@db/db';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule, TableRowSelectEvent } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { format } from 'date-fns';
import { CapitalizePipe } from '@pipes/captalize.pipe';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DividerModule } from 'primeng/divider';
import { DrawerModule } from 'primeng/drawer';
import { AddEditFormComponent } from "../../components/add-edit-form/add-edit-form.component";
import { fieldLabelMap } from '@config/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, TableModule, ButtonModule, TooltipModule, FormsModule, TagModule, ConfirmDialogModule, CapitalizePipe, IconFieldModule, InputIconModule, DividerModule, DrawerModule, AddEditFormComponent, DialogModule],
  providers: [ConfirmationService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  private dbService: NgxIndexedDBService = inject(NgxIndexedDBService);
  private messageService: MessageService = inject(MessageService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  people: Person[] = [];
  tableConfig: any = peopleTableConfig;
  searchValue: string = '';
  isEdit: boolean = false;
  selectedPerson: Person | null = null;
  selectedPersons: Person[] = [];
  globalSearchFields?: string[];
  toggleAddEditForm: boolean = false;
  showIntro: boolean = false;

  constructor() {
    this.globalSearchFields = peopleTableConfig.columns.filter(column => column.globalFilter !== false).map(column => column.field);
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe((queryParams) => {
      const showIntro = queryParams.get('showIntro');
      if (showIntro) {
        this.showIntro = showIntro === 'true';
      }

      // Remove the query parameter if it exists
      if (showIntro) {
        this.router.navigate([], {
          queryParams: { showIntro: null }, // Set to null to remove it
          queryParamsHandling: 'merge', // Keep other existing query params
        });
      }
    });
    this.initializeDatabase();
  }

  initializeDatabase() {
    this.dbService.count(storeName).subscribe((recordCount) => {
      if (recordCount > 0) {
        console.log('Database already initialized.');
        this.getUsers();
      } else {
        console.log('Initializing database with sample data...');
        this.dbService.bulkAdd(storeName, generatePeopleData(100)).subscribe({
          next: () => {
            console.log('Sample data added to database.');
            this.getUsers();
          },
          error: (err) => {
            console.error('Error initializing database:', err);
          }
        });
      }
    });
  }

  getUsers() {
    this.dbService.getAll(storeName).subscribe((result: any) => {
      this.people = result;
      this.people.forEach((person: Person) => {
        person.fullName = this.getFullName(person);
        person.birthdate = person.birthdate ? format(person.birthdate, 'yyyy-MM-dd') : '';
        person.action = [
          { action: 'edit', iconClass: 'pi pi-pencil', tooltip: 'Edit', styleClass: 'text-blue-500' },
          { action: 'delete', iconClass: 'pi pi-trash', tooltip: 'Delete', styleClass: 'text-red-500' },
        ];
      });
      this.people = [...this.people.reverse()];
      console.log('result: ', this.people);
    });
  }

  getFullName(person: Person): string {
    return `${person.firstName ? person.firstName : ''} ${person.middleName ? person.middleName : ''} ${person.lastName ? person.lastName : ''}`.trim();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onActionClick(person: Person, action: string): void {
    switch (action) {
      case 'edit':
        this.isEdit = true;
        this.toggleAddEditForm = true;
        this.selectedPerson = person;
        break;
      case 'delete':
        this.onDelete(person);
        break;
    }
  }

  onDelete(person: Person) {
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete user ${person.fullName}?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        if (!person.id) return;
        this.dbService.delete(storeName, person.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record deleted successfully.' });
            this.getUsers();
          },
          error: (err: any) => {
            console.log(err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err });
          }
        });
      }
    });
  }

  onRowSelect(event: TableRowSelectEvent) {
    console.log(this.selectedPersons)
  }

  onRowUnselect(event: TableRowSelectEvent) {
    console.log(this.selectedPersons)
  }

  onRowDblClick(person: Person) {
    this.onActionClick(person, 'edit');
  }

  hideAddEditForm() {
    this.toggleAddEditForm = false;
    this.selectedPerson = null;
  }

  onSave(personForm: FormGroup) {
    personForm.markAllAsTouched();
    const invalidFields = Object.keys(personForm.controls)
      .filter((key) => personForm.get(key)?.invalid)
      .map((key) => fieldLabelMap[key] || key);

    if (personForm.valid) {
      const person = personForm.value;
      person.birthdate = person.birthdate ? format(person.birthdate, 'yyyy-MM-dd') : '';
      if (!this.isEdit) {
        delete person.id;
      }

      const action$ = this.isEdit
        ? this.dbService.update(storeName, person)
        : this.dbService.add(storeName, person);

      const successMessage = this.isEdit
        ? 'Record updated successfully.'
        : 'Record added successfully.';

      action$.subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: successMessage });
          this.hideAddEditForm();
          this.getUsers();
        },
        error: (err: any) => {
          console.error(err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err });
        }
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Please fill out all required fields: ${invalidFields.join(', ')}.`,
      });
    }
  }

  refreshDatabase() {
    this.dbService.clear(storeName).subscribe((successDeleted) => {
      console.log('success? ', successDeleted);
      if (successDeleted) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Database cleared successfully.' });
        this.initializeDatabase();
      }
    });
  }

  logout() {
    this.router.navigate(['/login']);
  }

}
