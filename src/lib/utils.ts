import { NextRouter } from "next/router";
import { MouseEvent } from "react";
import Cookies from "universal-cookie";
import AuthHandler from "./auth/AuthHandler";
import { TBearerCredentials } from "./clients/AirKitchenClient";


export function setFromPathCookie(path:string){
    const cookies = new Cookies();
    cookies.set('fromPath', path,{
        path:'/',
        domain: 'localhost'
    });
}

export function getFromPathCookie(){
    const cookies = new Cookies();
    const fromPath =  cookies.get('fromPath');
    cookies.remove('fromPath');
    return fromPath;
}


export async function getValidCredentialsOrRedirect(router: NextRouter) : Promise<TBearerCredentials> {
    const creds = await AuthHandler.getValidCredentials();
    if(!creds) {
        // set creds
        setFromPathCookie(router.asPath);
        router.push('/login');
        return undefined;
    }
    return creds;
}