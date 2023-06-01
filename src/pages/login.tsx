
import React from 'react';
import LoginForm from '@/components/Login';
import Head from 'next/head';
import CommonStyles from '@/styles/Common.module.css'


export default function Login() {
    return (
        <>
        <Head>
            <title>air kitchen</title>
            <meta name="description" content="Order management for catering" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <nav className={CommonStyles.navbar}>
            <div className={CommonStyles['navbar-button']}><h3>Nav</h3></div>
            <div className={CommonStyles['navbar-remainder']}><h3>Login</h3></div>
        </nav>
        <main className={CommonStyles.main}>
            <div className={CommonStyles.content}>
                <LoginForm/>
            </div>
        </main>
        </>
    )
}