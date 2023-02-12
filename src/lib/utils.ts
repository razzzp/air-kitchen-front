import Cookies from "universal-cookie";

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
