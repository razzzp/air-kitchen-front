import { Autour_One } from "@next/font/google";
import { NextRouter } from "next/router";
import Cookies from "universal-cookie";
import { getAirKitchenClient, TBearerCredentials } from "../clients/AirKitchenClient";
import { setFromPathCookie } from "../utils";

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
        const now = Date.now();
        const nowD = new Date(now);
        const exp = creds.expiryDate;
        const expD = new Date(exp);
        if(creds.expiryDate > Date.now()) return true;
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