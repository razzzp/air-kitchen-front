import Cookies from "universal-cookie";
import { TBearerCredentials } from "../clients/AirKitchenClient";

const TOKEN_COOKIENAME = 'auth-token';

export default class AuthHandler {
    constructor() {
        
    }

    public static storeNewCredentials(credentials: TBearerCredentials){
        const cookies = new Cookies();
        cookies.set(TOKEN_COOKIENAME, credentials,
            {
                path:'/',
                domain:'localhost'
            });
    }

    public static getCredentials() : TBearerCredentials{
        const cookies = new Cookies();
        return cookies.get(TOKEN_COOKIENAME);
    }
}