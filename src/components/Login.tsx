import Axios from 'axios';
import React from 'react';
import styles from '@/styles/Home.module.css'

export default class LoginForm extends React.Component {
    constructor(props: {}) {
        super(props);
    }

    onGoogleLogin(data: any) {
        // console.log(data);

        Axios.post('http://localhost:3001/api/v1/testgooglelogin', data)
            .then(val => console.log(val.data))
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
            <main className={styles.main}>
                <div className={styles.card}>
                    <div className={styles['form-title']}><h2 >Login</h2></div>
                    <form  action="/login" method="POST" className="needs-validation" noValidate>

                        <div className={styles['form-body']}>
                            <div className={styles['form-field-group']}>
                                <label htmlFor="username">Username:</label>
                                <input type="text" className="form-control" name="username" id="username"  required />
                            </div>
                            <div className={styles['form-field-group']}>
                                <label htmlFor="password">Password:</label>
                                <input type="password" className="form-control" name="password" id="password" required />
                            </div>
                            <div className={styles['form-field-group']}>
                            <div className="col-2">
                                <button type="submit" className="btn btn-primary mt-3 w-100">Login</button>
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
                </div>
            </main>
            </>
        ); 
    }
}