import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TaskListService, TaskList } from './tasklist.service';
import { map, tap } from 'rxjs/operators';
import { XFormRow } from '@ng-nest/ui/form';
import { UntypedFormGroup } from '@angular/forms';
import { XMessageBoxService } from '@ng-nest/ui/message-box';
import { PageBase } from 'src/share/base/base-page';
import { IndexService } from 'src/layout/index/index.service';
import { XQuery, XTableColumn } from '@ng-nest/ui';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-TaskList',
  templateUrl: 'tasklist.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskListComponent extends PageBase {
  formGroup = new UntypedFormGroup({});
  index = 1;
  query: XQuery = { filter: [] };

  get disabled() {
    return !['edit', 'add', 'add-root'].includes(this.type);
  }

  type = 'info';

  selected!: TaskList;

  activatedId!: string;

  treeLoading = true;

  tasksLoading=false;
  data = () =>
    this.service
      .getList(1, Number.MAX_SAFE_INTEGER, {
        sort: [
          { field: 'pid', value: 'asc' },
          { field: 'sort', value: 'asc' }
        ]
      })
      .pipe(
        tap(() => (this.treeLoading = false)),
        map((x) => x.list)
      );



  controls: XFormRow[] = [
    {
      controls: [
        {
          control: 'input',
          id: 'label',
          label: '名称',
          required: true
        },
        { control: 'input', id: 'icon', label: '图标' },
        {
          control: 'select',
          id: 'type',
          label: '类型',
          data: [
            { id: 'group', label: '事业部' },
            { id: 'subsidiary', label: '子公司' },
            { id: 'department', label: '部门' }
          ],
          value: 'department'
        },
        { control: 'input', id: 'sort', label: '顺序' }
      ]
    },
    {
      hidden: true,
      controls: [
        {
          control: 'input',
          id: 'id'
        },
        {
          control: 'input',
          id: 'pid'
        }
      ]
    }
  ];

  columns: XTableColumn[] = [
    { id: 'index', label: '序号', width: 80, left: 0, type: 'index' },
    { id: 'taskicon', label: '任务图标', width: 100, left: 80 },
    { id: 'actions', label: '任务名称', width: 100, left: 80 },
    { id: 'account', label: '用户', width: 100, left: 180, sort: true },
    { id: 'name', label: '姓名', width: 80, sort: true },
    { id: 'email', label: '邮箱', flex: 1 },
    { id: 'phone', label: '电话', flex: 1 }
  ];
  constructor(
    private service: TaskListService,
    public override indexService: IndexService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private msgBox: XMessageBoxService
  ) {
    super(indexService);
  }

  ngOnInit() {

  }

  action(type: string,item?: any) {
    console.log(item)
    switch (type) {

      case 'add':
        this.type = type;
        let param = {};
        if (this.selected) {
          param = { selectedId: this.selected?.id, selectedLabel: this.selected?.label };
        }
        this.router.navigate([`./${type}`, param], { relativeTo: this.activatedRoute });
        break;
        break;

      case 'delete':
        this.msgBox.confirm({
          title: '提示',
          // content: `此操作将永久删除此条数据：${node.label}，是否继续？`,
          type: 'warning',
          // callback: (action: XMessageBoxAction) => {
          //   action === 'confirm' &&
          //     this.service.delete(node.id).subscribe(() => {
          //       this.treeCom.removeNode(node);
          //       this.formGroup.reset();
          //       this.message.success('删除成功！');
          //     });
          // }
        });
        break;
      case 'cancel':
        this.type = 'info';
        this.formGroup.reset();
        break;
    }
  }
}
