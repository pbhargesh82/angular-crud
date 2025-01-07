import {Routes} from '@angular/router';
import {DashboardComponent} from '@routes/dashboard/dashboard.component';
import {LoginComponent} from '@routes/login/login.component';

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {
    path: 'dashboard',
    component: DashboardComponent,
    //   canActivate: [authGuard],
    //   children: [
    //     { path: 'people', component: PeopleComponent },
    //     { path: 'people/:eventId/:eventName', component: EventTableComponent },
    //     { path: 'tags', component: TagsComponent },
    //     { path: 'users', component: UsersComponent },
    //     { path: 'events', component: EventsComponent },
    //     { path: 'requests', component: RequestsComponent },
    //     { path: 'orders', component: OrdersInboxComponent },
    //     { path: 'logs', component: LogsComponent },
    //     { path: '', redirectTo: 'people', pathMatch: 'full' }, // Default route for dashboard
    //   ],
  },
  {path: '', redirectTo: '/login', pathMatch: 'full'}, // Default route for app
  {path: '**', redirectTo: '/login'}, // Fallback route
];
