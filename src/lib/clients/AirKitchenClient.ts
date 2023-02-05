import Axios from "axios";
import Cookies from "universal-cookie";
import AuthHandler from "../auth/AuthHandler";

interface IUser {
    displayName: string
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
            const auth = new AuthHandler();
            auth.storeNewCredentials(creds);
            return response;
        } catch(e) {
            if (Axios.isAxiosError(e)){
                console.error(e.response?.data);
            } else {
                console.error(e);
            }
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
            const auth = new AuthHandler();
            auth.storeNewCredentials(creds);
            return response;
        } catch(e) {
            if (Axios.isAxiosError(e)){
                console.error(e.response?.data);
            } else {
                console.error(e);
            }
        }
    }
}