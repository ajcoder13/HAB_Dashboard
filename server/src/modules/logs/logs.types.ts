export type LogBody = {
    id : number;
    timestamp : Date;
    level : string;
    message : string;
    method : string;
    url : string;
    status_code : number;
    response_time : number;
}

export interface Log extends LogBody {
    correlation_id : string;
    user_agent : string;
    meta : Record<string, any>;
    ip_address : string;
}