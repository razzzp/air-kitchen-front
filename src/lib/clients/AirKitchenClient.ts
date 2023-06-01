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
    id?: number;
    name: string;
    desc: string;
    status: EOrderStatus;
    salePrice: string;
    dueDate?: Date;
}

export interface IOrderToPost {
    id?: number;
    name: string;
    description: string;
    status: string;
    salePrice: string;
    dueDate?: Date;
}

export interface IOrderToPut {
    id: number;
    name?: string;
    description?: string;
    status?: string;
    salePrice?: string;
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

    private static _deprecated_parseEOrderStatus(value : string){
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

    private static _getEOrderStatusAsInt(value : EOrderStatus){
        switch (value){
            case EOrderStatus.Pending:
                return 0;
            case EOrderStatus.InProgress:
                return 1;
            case EOrderStatus.OnHold:
                return 2;
            case EOrderStatus.Done:
                return 3;
            case EOrderStatus.Cancelled:
                return 4;
        }
        throw new Error('cannot parser Order Status')
    }

    private static _parseIOrder(data: any) : IOrder{
        const result = {
            id: <number> undefined,
            name: '',
            desc: '',
            status: <EOrderStatus>undefined,
            dueDate: <Date>undefined,
            salePrice: ''
        }
        if(typeof data !== 'object') return undefined;
        if(!('id' in data)) return undefined;
        result.id = data.id;
        if('name' in data && typeof data.name === 'string') result.name = data.name;
        if('description' in data && typeof data.description === 'string') result.desc = data.description;
        if('status' in data && typeof data.status === 'string') result.status = <EOrderStatus>(data.status);
        if('dueDate' in data && typeof data.dueDate === 'string') result.dueDate = new Date(data.dueDate);
        if('salePrice' in data && typeof data.salePrice === 'string') result.salePrice = data.salePrice;

        return result;
    }
    

    public static async retrieveOrders(creds: ICredentials): Promise<Array<IOrder>> {
        const getConfig = AirKitchenClient._buildAxiosRequestConfig(creds);

        const response = await Axios.get('http://localhost:3001/api/v1/orders', getConfig);
        if(!response || !Array.isArray(response.data)) return undefined;

        const listOfOrders = response.data.map(AirKitchenClient._parseIOrder)
        return listOfOrders;
    }

    public async refreshAccessToken(refreshToken: string) : Promise<TBearerCredentials>{
        if(refreshToken === '') return undefined;
        try{
            const body = {
                refreshToken: refreshToken,
            };
            const response = await Axios.post('http://localhost:3001/api/v1/login/refresh-token',body);
            if (!this._validateBearerCredentials(response.data)) return undefined;
            
            return response.data;
        } catch(e) {
            console.error(`Error when trying to refresh access token. ${e}`);
            return undefined;
        }
    }

    public static async postNewOrder(newOrder: IOrderToPost, creds: ICredentials) : Promise<IOrder>{
        const postConfig = AirKitchenClient._buildAxiosRequestConfig(creds);

        const response = await Axios.post('http://localhost:3001/api/v1/orders', newOrder, postConfig);
        if(!response) return undefined;

        const savedOrder = AirKitchenClient._parseIOrder(response.data);
        return savedOrder;
    }

    public static async putOrder(order: IOrderToPut, creds: ICredentials) : Promise<IOrder>{
        const putConfig = AirKitchenClient._buildAxiosRequestConfig(creds);

        const response = await Axios.put(`http://localhost:3001/api/v1/orders/${order.id}`, order, putConfig);
        if(!response) return undefined;

        const savedOrder = AirKitchenClient._parseIOrder(response.data);
        return savedOrder;
    }

    public static async retrieveOrder(orderId: string, creds: ICredentials) : Promise<IOrder> {
        const getConfig = AirKitchenClient._buildAxiosRequestConfig(creds);

        const response = await Axios.get(`http://localhost:3001/api/v1/orders/${orderId}`, getConfig);
        if(!response) return undefined;

        const retrievedOrder = AirKitchenClient._parseIOrder(response.data);
        return retrievedOrder;
    }
    
    public static async deleteOrder(orderId: string, creds: ICredentials) : Promise<any> {
        const deleteConfig = AirKitchenClient._buildAxiosRequestConfig(creds);
        
        const resp = await Axios.delete(`http://localhost:3001/api/v1/orders/${orderId}`, deleteConfig);
        return resp.data;
    }

    public static buildNewOrder() : IOrder{
        const newOrder = new Order();
        newOrder.id = undefined;
        newOrder.name = 'New Order';
        newOrder.desc = '';
        newOrder.status = EOrderStatus.Pending;
        newOrder.dueDate = undefined;
        newOrder.salePrice = '0';
        return newOrder;
    }

    public static buildOrderForPost(order: IOrder) {
        const newOrder = new OrderToPost();
        newOrder.id = order.id;
        newOrder.name = order.name;
        newOrder.description = order.desc;
        newOrder.status = order.status;
        newOrder.dueDate = order.dueDate;
        newOrder.salePrice = order.salePrice;
        return newOrder;
    }   

    public static buildOrderForPut(order: IOrder) {
        const orderToPut = new OrderToPut();
        orderToPut.id = order.id;
        orderToPut.name = order.name;
        orderToPut.description = order.desc;
        orderToPut.status = order.status;
        orderToPut.dueDate = order.dueDate;
        orderToPut.salePrice = order.salePrice;
        return orderToPut;
    }  
}

class Order implements IOrder {
    id?: number;
    name: string;
    desc: string;
    status: EOrderStatus;
    salePrice: string;
    dueDate?: Date;
}

class OrderToPost implements IOrderToPost {
    id?: number;
    name: string;
    description: string;
    status: string;
    salePrice: string;
    dueDate?: Date;
    
}

class OrderToPut implements IOrderToPut {
    id: number;
    name?: string;
    description?: string;
    status?: string;
    salePrice?: string;
    dueDate?: Date;
}

export function getAirKitchenClient(){
    return new AirKitchenClient();
}