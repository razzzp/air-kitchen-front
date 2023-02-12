import { Autour_One } from "@next/font/google";
import Cookies from "universal-cookie";
import AirKitchenClient, { getAirKitchenClient, TBearerCredentials } from "../clients/AirKitchenClient";

const TOKEN_COOKIENAME = 'auth-token';

export default class AuthHandler {
    constructor() {
        
    }

    public static storeNewCredentials(credentials: TBearerCredentials){
        const cookies = new Cookies();
        // expires in 14 days
        cookies.set(TOKEN_COOKIENAME, credentials,
            {
                path:'/',
                expires: new Date(Date.now() + 14*24*60*60*1000),
                domain:'localhost'
            });
    }

    public static getCredentials() : TBearerCredentials{
        const cookies = new Cookies();
        return cookies.get(TOKEN_COOKIENAME);
    }

    private static _areCredentialsValid(creds: TBearerCredentials) : boolean {
        if(creds.expiryDate < Date.now()) return true;
        //
        return false;
    }

    public static async getValidCredentials() : Promise<TBearerCredentials>{
        const curCreds = AuthHandler.getCredentials();
        if(!curCreds) return null;

        if(AuthHandler._areCredentialsValid(curCreds)) return curCreds;
        // creds not valid, try to refresh
        const newCreds = await getAirKitchenClient().refreshAccessToken(curCreds.refreshToken);
        if (!newCreds) return null;

        AuthHandler.storeNewCredentials(newCreds);
        return newCreds;
    }
}