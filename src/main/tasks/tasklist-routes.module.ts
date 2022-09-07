import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskDetailComponent } from './taskdetail/task-detail.component';
import { TaskListComponent } from './tasklist.component';

const routes: Routes = [
  { path: '', component: TaskListComponent },
  { path: ':type', component: TaskDetailComponent },
  { path: ':type/:id', component: TaskDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskListRoutesModule {}
