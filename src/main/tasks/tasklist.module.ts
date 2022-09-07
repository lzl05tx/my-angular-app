import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskListRoutesModule } from './tasklist-routes.module';
import { TaskListComponent } from './tasklist.component';
import { ShareModule } from 'src/share/share.module';
import { AuToolModule } from 'src/share/tool/tool.module';
import { AuAdaptionModule } from 'src/share/adaption/adaption.module';
import { NgNestModule } from 'src/share/ng-nest.module';
import { TaskDetailComponent } from './taskdetail/task-detail.component';

@NgModule({
  imports: [
    CommonModule,
    ShareModule,
    NgNestModule,
    AuToolModule,
    AuAdaptionModule,
    TaskListRoutesModule
  ],
  declarations: [TaskListComponent,TaskDetailComponent]
})
export class TaskListModule {}
