
import React, { ChangeEvent, FormEvent } from 'react';
import FormStyles from '@/styles/Form.module.css';
import HomeStyles from '@/styles/Home.module.css';
import ButtonStyles from '@/styles/Button.module.css';
import AirKitchenClient from '@/lib/clients/AirKitchenClient';
import AuthHandler from '@/lib/auth/AuthHandler';
import Router from 'next/router';
import Card from './Card';

type TLoginResponse = {
    tokenType:string; 
    accessToken:string; 
    expiryDate:number;
    refreshToken:string
}

interface IUser {
    displayName: string
}

interface IProps {

}

interface IState {
    username: string;
    password: string;
    user?: IUser;
}

export default class LoginForm extends React.Component<IProps, IState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            username:'',
            password:''
        };
    }

    validateLoginResponse(data : any): data is TLoginResponse{
        if(!data) return false;
        if(
            typeof data.tokenType === 'string'
            && typeof data.accessToken === 'string'
            && typeof data.expiryDate === 'number'
            && typeof data.refreshToken === 'string'
        ) return true;
        else return false;
    }

    async onGoogleLogin(data: any) {
        // console.log(data);
        try{
            const client = new AirKitchenClient();
            const response = await client.doGoogleLogin(data);
            
            console.log(response);
            Router.push('/');
        } catch(e) {
            console.error(e);
            alert('Failed to login')
        }
    }

    async onBasicLogin(e: FormEvent) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        try {
            const client = new AirKitchenClient();
            const res = await client.doBasicLogin(this.state.username, this.state.password);

            console.log(res);
            Router.push('/');
        } catch (e) {
            console.error(e);
            alert('Failed to login');
        }
    }

    useExternalScripts(url: string){
          const head = document.querySelector("head");
          const script = document.createElement("script");
      
          if(!head) return;
      
          script.setAttribute("src", url);
          head.appendChild(script);
      
          return () => {
            head.removeChild(script);
          };
      };

    componentDidMount(): void {
        (window as any).onGoogleLogin = this.onGoogleLogin;
        this.useExternalScripts('https://accounts.google.com/gsi/client');
        const creds = AuthHandler.getCredentials();
        if(creds) this.setState({user:creds.user});
    }

    onUsernameChange(e: ChangeEvent<HTMLInputElement>){
        this.setState({username: e.target.value});
    }

    onPasswordChange(e: ChangeEvent<HTMLInputElement>){
        this.setState({password: e.target.value});
    }

    render(): React.ReactNode {    
        return (
            <>
            <main className={HomeStyles.main}>
                <Card>
                    <div className={FormStyles['form-title']}><h2 >Login</h2></div>
                    <form  onSubmit={this.onBasicLogin.bind(this)} noValidate>
                        <div className={FormStyles['form-body']}>
                            <div className={FormStyles['form-field-group']}>
                                <label>
                                    Username: <input type="text" className="form-control" onChange={this.onUsernameChange.bind(this)} required />
                                </label>
                            </div>
                            <div className={FormStyles['form-field-group']}>
                                <label>
                                    Password: <input type="password" className="form-control" onChange={this.onPasswordChange.bind(this)} required />
                                </label>
                            </div>
                            <div className={FormStyles['form-field-group']}>
                                <div className="col-2">
                                    <button type="submit" className={ButtonStyles['button-38']}>Login</button>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div id="g_id_onload"
                        data-client_id="325790205622-r4pns2qk3lni19mrud8pvlp69dc3q4ea.apps.googleusercontent.com"
                        data-context="signin"
                        data-ux_mode="popup"
                        data-callback="onGoogleLogin"
                        data-auto_prompt="false">
                    </div>
        
                    <div className="g_id_signin"
                        data-type="standard"
                        data-shape="rectangular"
                        data-theme="outline"
                        data-text="signin_with"
                        data-size="large"
                        data-logo_alignment="left">
                    </div>
                </Card>
            </main>
            </>
        ); 
    }
}