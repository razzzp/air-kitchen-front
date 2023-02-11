import Axios, { RawAxiosRequestConfig } from "axios";
import { listenerCount } from "process";
import { isThrowStatement } from "typescript";
import AuthHandler from "../auth/AuthHandler";

export interface IUser {
    displayName: string;
}


export enum EOrderStatus {
    Pending = 'Pending',
    InProgress = 'In Progress',
    OnHold = 'On Hold',
    Done = 'Done',
    Cancelled = 'Cancelled',
}

export interface IOrder {
    id: number;
    name: string;
    desc: string;
    status: EOrderStatus;
    salePrice: string;
    dueDate?: Date;
}

export interface IBasicCredentials {
    username: string;
    password: string;
}

export interface ICredentials {
    token? : string;
    auth? : IBasicCredentials;
}

export type TBearerCredentials = {
    user: IUser;
    tokenType:string; 
    accessToken:string; 
    expiryDate:number;
    refreshToken:string
}

export type TBasicLoginData = {
    username: string;
    password: string;
}

export default class AirKitchenClient {
    
    /**
     *
     */
    constructor() {
        
    }
    
    private _validateBasicLoginData(data : any) : data is TBasicLoginData {
        if(!data) return false;

        if(!(typeof (data.username) !== 'string')) return false;
        if(!(typeof (data.password) !== 'string')) return false;
        return true;
    }


    public async doBasicLogin(username: string, password: string){
        if(username === '' || password === '') return false;

        try{
            const body = {
                username: username,
                password: password
            };
            const response = await Axios.post('http://localhost:3001/api/v1/login',body);
            if (!this._validateBearerCredentials(response.data)) throw new Error('Invalid response');
            // store creds
            const creds = response.data;
            AuthHandler.storeNewCredentials(creds);
            return response;
        } catch(e) {
            throw e;
        }
    }

    private _validateBearerCredentials(data : any): data is TBearerCredentials{
        if(!data) return false;
        if(
            typeof data.tokenType === 'string'
            && typeof data.accessToken === 'string'
            && typeof data.expiryDate === 'number'
            && typeof data.refreshToken === 'string'
            &&  (data.user) && typeof data.user.displayName === 'string'
        ) return true;
        else return false;
    }

    public async doGoogleLogin(data : any){
        try{
            const response = await Axios.post('http://localhost:3001/api/v1/login-google', data);
            if (!this._validateBearerCredentials(response.data)) throw new Error('Invalid response');

            // store creds
            const creds = response.data;
            AuthHandler.storeNewCredentials(creds);
            return response;
        } catch(e) {
            throw e;
        }
    }

    private static _buildAxiosRequestConfig(credentials: ICredentials): RawAxiosRequestConfig {
        if (credentials.token){
            return {
                headers:{
                    Authorization: `Bearer ${credentials.token}`
                }
            }
        } else if (credentials.auth) {
            return {
                auth : credentials.auth
            }
        }
    }

    private static _parseEOrderStatus(value : string){
        switch (value){
            case '0':
                return EOrderStatus.Pending;
            case '1':
                return EOrderStatus.InProgress;
            case '2':
                return EOrderStatus.OnHold;
            case '3':
                return EOrderStatus.Done;
            case '4':
                return EOrderStatus.Cancelled;
        }
        throw new Error('cannot parser Order Status')
    }

    private static _parseIOrder(data: any) : IOrder{
        const result = {
            id: <number> null,
            name: '',
            desc: '',
            status: <EOrderStatus>null,
            dueDate: <Date>null,
            salePrice: ''
        }
        if(typeof data !== 'object') return null;
        if(!('id' in data)) return null;
        result.id = data.id;
        if('name' in data && typeof data.name === 'string') result.name = data.name;
        if('desc' in data && typeof data.desc === 'string') result.desc = data.desc;
        if('status' in data && typeof data.status === 'string') result.status = AirKitchenClient._parseEOrderStatus(data.status);
        if('dueDate' in data && typeof data.dueDate === 'string') result.dueDate = new Date(data.dueDate);
        if('salePrice' in data && typeof data.salePrice === 'string') result.salePrice = data.salePrice;

        return result;
    }
    

    public static async retrieveOrders(creds: ICredentials): Promise<Array<IOrder>> {
        const getConfig = AirKitchenClient._buildAxiosRequestConfig(creds);

        const response = await Axios.get('http://localhost:3001/api/v1/orders', getConfig);
        if(!response || !Array.isArray(response.data)) return null;

        const listOfOrders = response.data.map(AirKitchenClient._parseIOrder)
        return listOfOrders;
    }
}