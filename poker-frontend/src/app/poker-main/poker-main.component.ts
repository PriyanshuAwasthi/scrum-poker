import { Component, Inject, OnInit } from '@angular/core';
import { ColumnType, tableColumns } from '../helper/tableColumns.model';
import { usersDataModel } from '../helper/user-data.model';
import {MatTableDataSource} from '@angular/material/table';
import { Socket } from 'ngx-socket-io';
import { SocketService } from '../helper/socket.service';

@Component({
  selector: 'app-poker-main',
  templateUrl: './poker-main.component.html',
  styleUrl: './poker-main.component.css'
})
export class PokerMainComponent implements OnInit {
  showEstimates: boolean = false;
  protected readonly ColumnType = ColumnType;
  numberOfDays: Array<number> = [0.5, 1, 2, 3, 4, 5];
  estimatesHidden: boolean = false;

  backednRes: {
    sender: string,
    user: string
  }[] = [];

  users: usersDataModel[] = [
    {
      name: 'Priyanshu',
      hidden: true,
      estimate: 4
    },
    {
      name: 'div',
      estimate: 3,
      hidden: true
    },
    {
      name: 'xyz'
    },
    {
      name: 'xyz'
    },
    {
      name: 'xyz'
    },
    {
      name: 'div'
    },
    {
      name: 'xyz'
    },
    {
      name: 'xyz'
    },
    {
      name: 'xyz'
    },
    {
      name: 'div'
    },
    {
      name: 'xyz'
    },
    {
      name: 'xyz'
    },
    {
      name: 'xyz'
    },
    {
      name: 'xyz'
    },
    {
      name: 'xyz'
    },
    {
      name: 'Anushka'
    }
  ];

  initColumns: tableColumns[] = [
    {
      field: 'name',
      label: 'Name',
      type: ColumnType.TEXT
    },
    {
      field: 'estimate',
      label: 'Story Points',
      type: ColumnType.CUSTOM
    }
  ];

  dataSource!: MatTableDataSource<usersDataModel>;

  displayedColumns = this.initColumns.map((column) => column.field);

  constructor(@Inject(SocketService) private socketService: SocketService) {}
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.users);
    this.socketService.testReceivingMessage().subscribe((res) => console.log(res));
    // console.log('heyyy');
    // this.socket.fromEvent('received').pipe((data) => data).subscribe((data) => {
    //   console.log(data);
    // })
  }

  dataAccessor(element: usersDataModel, column: string): string | any {
    if (column === 'name') return element.name;
    if (column === 'estimate' && !this.isNullOrUndefined(element.estimate)) return element.estimate;
  }

  showEstimate(): void {
    this.estimatesHidden = false;
    this.users.forEach((user) => user.hidden = false);
  }

  hideEstimate(): void {
    this.estimatesHidden = true;
    this.users.forEach((user) => user.hidden = true);

  }

  isNullOrUndefined(value: any): boolean {
    if (value === undefined) return true;
    if (value === null) return true;
    return false;
  }


  handleTestButtonClick(): void {
    // this.socket.emit('score', 2);
    this.socketService.testSendingMethod('3');
  }
}
