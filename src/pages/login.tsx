import Axios from 'axios';
import React from 'react';

export default class Login extends React.Component {
    constructor(props: {}) {
        super(props);
    }

    async onGoogleLogin(data: any) {
        console.log(data);

        Axios.post('http://localhost:3001/api/v1/testgooglelogin', data)
            .then(val => console.log(val))
            .catch(err=> console.error(err));
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
    }

    render(): React.ReactNode {    
        return (
            <>
            <main className="container">
                <h1>Login</h1>
                <form action="/login" method="POST" className="needs-validation" noValidate>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input type="text" className="form-control" name="username" id="username" 
                            value="" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" className="form-control" name="password" id="password" 
                            value="" required />
                    </div>
                    <div className="row g-2 justify-content-start">
                    <div className="col-2">
                        <button type="submit" className="btn btn-primary mt-3 w-100">Login</button>
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
            </main>
            </>
        ); 
    }
}