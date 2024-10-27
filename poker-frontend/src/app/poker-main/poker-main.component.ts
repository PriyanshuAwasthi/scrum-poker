import { Component, Inject, OnInit } from '@angular/core';
import { ColumnType, tableColumns } from '../helper/tableColumns.model';
import { usersDataModel } from '../helper/user-data.model';
import {MatTableDataSource} from '@angular/material/table';
import { Socket } from 'ngx-socket-io';
import { SocketService } from '../helper/socket.service';
import { Router } from '@angular/router';
import { DialogResult } from '../join-room-dialog/join-room-dialog.component';

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
  newUser!: {name: string, roomNumber: string, email: string};

  backednRes: {
    sender: string,
    user: string
  }[] = [];

  users: usersDataModel[] = [];

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

  constructor(
    @Inject(SocketService) private socketService: SocketService,
    private router: Router
  ){
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const state = navigation.extras.state as NavigationInterface;
      this.newUser = state.result;
    }
    // console.log((navigation as DialogResult).roomNumber);
  }


  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.users);
    this.socketService.testReceivingMessage().subscribe((res) => console.log(res));

    this.socketService.recieveBroadCastForNewUser().subscribe((res) => {
      if (!this.isNullOrUndefined(res)) {
        this.dataSource.data.push({
          name: res.name,
          email: res.email,
          hidden: false
        })
      }
    })

    // Create new user object
    const userInfo: SocketInfo = Object.assign(<SocketInfo>{
      email: this.newUser.email,
      room: this.newUser.roomNumber,
      name: this.newUser.name
    });

    // emit new user to socket
    this.socketService.joinRoom(userInfo);

    // push new user to datasource
    this.dataSource.data.push({
      name: this.newUser.name,
      email: this.newUser.email,
      hidden: false
    })
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
    this.socketService.testSendingMethod('3');
  }
}

interface NavigationInterface {
  result: {
    name: string,
    roomNumber: string,
    email: string
  }
}

export interface SocketInfo {
  email: string,
  name: string,
  room: string
}

export interface scoreInfo extends SocketInfo {
  score: number, 
  hidden: boolean
}
