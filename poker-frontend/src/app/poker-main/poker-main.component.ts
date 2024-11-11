// TODO - Remove user (frontend and backend) (web scokets, session)
// TODO - Custom days dialog
// TODO - ngOnDestroy when user closes the window or goes back maybe (web scokets, session)

// DONE - Landing page when comes without creating room (ERROR LANDING PAGE) [CAN BE BETTER]


import { ChangeDetectorRef, Component, inject, Inject, OnInit } from '@angular/core';
import { ColumnType, tableColumns } from '../helper/tableColumns.model';
import { SocketInfo, usersDataModel } from '../helper/user-data.model';
import { MatTableDataSource } from '@angular/material/table';
import { SocketService } from '../helper/socket.service';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AverageDialogComponent } from '../average-dialog/average-dialog.component';
import { DialogResult, JoinRoomDialogComponent } from '../join-room-dialog/join-room-dialog.component';

@Component({
  selector: 'app-poker-main',
  templateUrl: './poker-main.component.html',
  styleUrl: './poker-main.component.css'
})
export class PokerMainComponent implements OnInit {
  dialog = inject(MatDialog);
  showEstimates: boolean = false;
  protected readonly ColumnType = ColumnType;
  numberOfDays: Array<number> = [0.5, 1, 2, 3, 4, 5];
  estimatesHidden: boolean = false;
  removeMode: boolean = false;
  currentUser!: {name: string, room: string, email: string};
  currUser!: any;

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
    private fb: FormBuilder,
    @Inject(SocketService) private socketService: SocketService,
    private router: Router,
    private route: ActivatedRoute,
    private changeDetectorRefs: ChangeDetectorRef
  ){
    if (sessionStorage.length > 0 && this.route.snapshot.params['room'] !== JSON.parse(sessionStorage?.getItem('roomData') as string)?.room) {
      sessionStorage.clear();
    }
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const state = navigation?.extras.state as NavigationInterface;
      this.currentUser = state.result;
    } else if (!this.isNullOrUndefined(sessionStorage.getItem('roomData'))) {
      this.currentUser = {...JSON.parse(sessionStorage?.getItem('roomData') as string)}
    }
    else {
      let room = this.route.snapshot.params['room'];
      console.log('enter', room);
      const dialogRef = this.dialog.open(JoinRoomDialogComponent, {
        data: {
          type: 'joinExisting',
          room: room
        }
      });
      dialogRef.afterClosed().subscribe((result: DialogResult) => {
        console.log(result);
        if (!this.isNullOrUndefined(result)) {
          this.currentUser = {...result}
          sessionStorage.setItem('roomData', JSON.stringify(result))
          this.ngOnInit();
        }
      })
    }
  }


  ngOnInit(): void {
    if (!this.isNullOrUndefined(this.currentUser)) {
      this.dataSource = new MatTableDataSource(this.users);

      this.setupSubscriptionForRecievingExisitngUsers();
      this.setupSubscriptionForRecievingBroadCastForNewUser();
      this.setupUpdateScoreSubscription();
      this.setupToggleCardsSubscription();
      this.setupDeleteEventSubscription();
      this.setupSubscriptionForShowAvg();

      // Create new user object
      const userInfo: SocketInfo = {...this.currentUser, estimatesHidden: false, hidden: false, estimate: -1}

      // emit new user to socket
      this.socketService.joinRoom(userInfo); 
      // }
    }
  }

  dataAccessor(element: usersDataModel, column: string): string | any {
    if (column === 'name') return element.name;
    if (column === 'estimate' && element.estimate === -1) return '_';
    if (column === 'estimate' && (element.estimate as number) < -1) return '';
    if (column === 'estimate') return element.estimate;
  }


  /**
   * Handle Delete estimate button click
   */
  deleteEstimates(): void {
    this.socketService.deleteEstimatesEvent(this.currentUser.room);
  }

  /**
   * Show all estimates
   */
  showEstimate(): void {
    this.socketService.toggleCards(false, this.currentUser.room);
    this.socketService.showAvgDialog(this.currentUser.room);
  }

  /**
   * Hide all estimates
   */
  hideEstimate(): void {
    this.socketService.toggleCards(true, this.currentUser.room);
  }

  isNullOrUndefined(value: any): boolean {
    if (value === undefined) return true;
    if (value === null) return true;
    if (value.length == 0) return true;
    return false;
  }

  /**
   * 
   * @param hide Toggle the cards to show or hide
   */
  toggleScores(hide: boolean): void {
    this.users.forEach((user) => user.hidden = hide);
  }


  handleDaysButtonClick(estimate: number): void {
    var storyPoints = estimate * 2;
    const user = {...this.currUser, estimate: storyPoints, hidden: true, estimatesHidden: true}
    this.socketService.updateScore(user as SocketInfo);
  }

  removeModeToggle(): void {
    this.removeMode = !this.removeMode;
    this.changeDetectorRefs.detectChanges();
  }

  showAverage(): void {
    let sum = 0;
    let people = 0;
    this.dataSource.data.forEach((user) => {
      if ((user.estimate as number) > 0) {
        sum += (user.estimate as number);
        people++;
      }
    });
    const dialogRef = this.dialog.open(AverageDialogComponent, {
      data: {
        avg: Math.round((sum / people) * 2) / 2
      }
    })
  }

  /**
   * Setup Subscription to get the new user
   */
  setupSubscriptionForRecievingBroadCastForNewUser(): void {
    this.socketService.receiveBroadCastForNewUser().subscribe((user: SocketInfo) => {
      if (!this.isNullOrUndefined(user)) {
        // Check if new user is already there
        if (!this.dataSource.data.some((data) => data.email === user.email)) {
          this.users.push({
            email: user.email,
            name: user.name,
            hidden: this.isNullOrUndefined(user.hidden) ? false : user.hidden,
            estimate: this.isNullOrUndefined(user.estimate) ? user.estimate : -1
          });
          this.dataSource.data = this.users;
        }
      }
    });
  }


  /**
   * Setup Subscription to get the existing users for the new user
   * --- user already exists
   * --- user is alone 
   * --- user came for the first time
   */
  setupSubscriptionForRecievingExisitngUsers(): void {
    this.socketService.receiveExisitngUsers().subscribe((existingUsers: SocketInfo[]) => {
      for (let user of existingUsers) {
        if (user.email !== this.currentUser?.email) {
          this.estimatesHidden = user.estimatesHidden;
          this.users.push(user);
        }
      }
      let currentUserExists = existingUsers.find((exist) => exist.email === this.currentUser?.email);
      if (this.isNullOrUndefined(currentUserExists)) {
        currentUserExists = {...this.currentUser, estimatesHidden: this.estimatesHidden, hidden: false, estimate: -1}
      }
      this.users.push(currentUserExists as usersDataModel);
      this.dataSource.data = this.users;
      if (this.isNullOrUndefined(this.currUser)) {
        this.currUser = this.dataSource.data.find((user) => user.email === this.currentUser?.email);
      }
    });
  }

  /**
   * Setup subscription to update score
   */
  setupUpdateScoreSubscription(): void {
    this.socketService.receiveUpdatedScore().subscribe((user) => {
        this.estimatesHidden = user.estimatesHidden || false;
        const index = this.dataSource.data.findIndex((data) => data.email === user.email);
        const updatedUser = {...user}
        if (index !== -1) {
          this.dataSource.data[index] = {...this.dataSource.data[index], ...updatedUser};
          this.dataSource.data = this.dataSource.data;
          this.changeDetectorRefs.detectChanges();
        }
    })
  }

  /**
   * Setup subscription to toggle cards
   */
  setupToggleCardsSubscription(): void {
    this.socketService.receiveToggledCards().subscribe((hidden) => {
      this.estimatesHidden = hidden
      this.toggleScores(hidden);
      this.changeDetectorRefs.detectChanges();
    })
  }

  /**
   * Setup subscription to delete the scores
   */
  setupDeleteEventSubscription(): void {
    this.socketService.delete().subscribe((res) => {
      this.estimatesHidden = false;
      this.dataSource.data.forEach((user) => {
        user.estimate = -1;
        user.hidden = false;
      })
      this.changeDetectorRefs.detectChanges();
    })
  }


  /**
   * Setup sibscription for showing avg
   */
  setupSubscriptionForShowAvg(): void {
    this.socketService.triggerShowAvg().subscribe((res) => {
      if (res) {
        this.showAverage();
      }
    })
  }
}

interface NavigationInterface {
  result: {
    name: string,
    room: string,
    email: string
  }
}