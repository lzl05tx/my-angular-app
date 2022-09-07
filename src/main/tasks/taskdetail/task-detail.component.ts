import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { XFormComponent, XControl } from '@ng-nest/ui/form';
import { SettingService } from 'src/services/setting.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NavService } from 'src/services/nav.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskDetailComponent implements OnInit {
  id!: string | null;
  type!: string | null;
  config = {
    labelWidth: '6rem'
  };
  taskIconSrc: string = "";
  controls: XControl[] = [
    {
      control: 'input',
      id: 'account',
      label: '任务图标',
      required: true,
      maxlength: 16,
      pattern: /^[A-Za-z0-9]{4,16}$/,
      message: '只能包括数字、字母的组合，长度为4-16位'
    },
    {
      control: 'input',
      id: 'password',
      label: '任务标题',
      type: 'password',
      required: true,
      maxlength: 16,
      pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\\W]{6,18}$/,
      message: '密码中必须包含字母和数字，长度为6-16位'
    },
    { control: 'input', id: 'name', label: '姓名', required: true },
    {
      control: 'find',
      id: 'organizations',
      label: '组织机构',
      required: true,
      multiple: true,
    },
    {
      control: 'find',
      id: 'roles',
      label: '角色',
      required: true,
      multiple: true,

      tableColumns: [
        { id: 'index', label: '序号', width: 80, left: 0, type: 'index' },
        { id: 'name', label: '角色名称', flex: 1, sort: true }
      ],
      tableRowHeight: 35,
      treeTableConnect: 'organizationId'
    },
    { control: 'input', id: 'email', label: '邮箱' },
    { control: 'input', id: 'phone', label: '电话' },
    { control: 'input', id: 'id', hidden: true, value: this.setting.guid() }
  ];

  @ViewChild('form') form!: XFormComponent;

  get formInvalid() {
    return this.form?.formGroup?.invalid;
  }

  get disabled() {
    return this.type === 'info';
  }

  constructor(
    private setting: SettingService,
    private activatedRoute: ActivatedRoute,
    private nav: NavService,
    private cdr: ChangeDetectorRef
  ) {
    this.activatedRoute.paramMap.subscribe((x: ParamMap) => {
      this.id = x.get('id');
      this.type = x.get('type');
      // this.selected = {
      //   id: x.get('selectedId'),
      //   label: x.get('selectedLabel') as string
      // };
      // if (this.selected.id) {
      //   (this.controls.find((x) => x.id === 'organizations') as XControl).value = [this.selected];
      // }
    });
  }

  ngOnInit() {
    this.action(this.type);
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  action(type: string | null) {
    switch (type) {
      // case 'info':
      //   this.service
      //     .get(this.id as string)
      //     .pipe(
      //       map((x) => {
      //         x.roles = x.roles?.map((y: any) => {
      //           y.label = y.name;
      //           return y;
      //         });
      //         return x;
      //       })
      //     )
      //     .subscribe((x) => {
      //       this.form.formGroup.patchValue(x);
      //     });
      //   break;
      // case 'edit':
      //   this.action('info');
      //   break;
      // case 'save':
      //   if (this.type === 'add') {
      //     this.service.post(this.setForm(this.form.formGroup.value)).subscribe(() => {
      //       this.message.success('新增成功！');
      //       this.nav.back(true);
      //     });
      //   } else if (this.type === 'edit') {
      //     this.service.put(this.setForm(this.form.formGroup.value)).subscribe(() => {
      //       this.message.success('修改成功！');
      //       this.nav.back(true);
      //     });
      //   }
      //   break;
      case 'cancel':
        this.nav.back();
        break;
    }
  }

  setForm(value: any) {
    this.setFind(value, 'organizations', 'roles');
    return value;
  }

  setFind(value: any, ...keys: string[]) {
    for (let key of keys) {
      let val = value[key];
      if (Array.isArray(val)) {
        value[key] = val.map((x) => ({ id: x.id, label: x.label }));
      } else {
        value[key] = [{ id: val.id, label: val.label }];
      }
    }
    return value;
  }

  //发送图片事件
  sendImg(event: Event) {
    const [file] = Array.from((<HTMLInputElement>event.target)?.files ?? []);
    const size = Math.floor(file.size / (1024 ** 2));
    if (size > 2) return alert("请选择2M以内图片!");
    if (!window?.FileReader) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    //监听文件读取结束后事件
    reader.onloadend =
      (e: ProgressEvent<FileReader>) =>{
        this.taskIconSrc = <string>e.target?.result;
        this.cdr.detectChanges();
      } ;
  }
}
