export interface NotificationInterface {
    id: number;
    type: string,
    notifiable: string,
    data: {
        actionURL: string,
        fas: string,
        title: string
    }
    read_at: string,
    [key: string]: unknown;
}
