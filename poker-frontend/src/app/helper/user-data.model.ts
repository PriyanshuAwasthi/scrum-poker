export interface usersDataModel {
    email: string; //mandatory
    name: string; //mandatory
    estimate?: number; 
    hidden: boolean; //mandatory
}

export interface SocketInfo extends usersDataModel {
    room: string; //mandatory
    estimatesHidden: boolean //mandatory
}
  