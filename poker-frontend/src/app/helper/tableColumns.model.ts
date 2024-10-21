export enum ColumnType {
    TEXT = 'text',
    CUSTOM = 'custom'
}

export class tableColumns {
    field!: string;
    label?: string;
    type?: ColumnType;
    sort?: boolean;
    method?: (item: any) => any;
}