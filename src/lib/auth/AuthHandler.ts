import Cookies from "universal-cookie";
import { TBearerCredentials } from "../clients/AirKitchenClient";

const TOKEN_COOKIENAME = 'auth-token';

export default class AuthHandler {
    constructor() {
        
    }

    public storeNewCredentials(credentials: TBearerCredentials){
        const cookies = new Cookies();
        cookies.set(TOKEN_COOKIENAME, credentials);
    }

    public getCredentials(){
        const cookies = new Cookies();
        return cookies.get(TOKEN_COOKIENAME);
    }
}