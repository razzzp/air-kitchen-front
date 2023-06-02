
import React from 'react';
import LoginForm from '@/components/Login';
import Head from 'next/head';
import CommonStyles from '@/styles/Common.module.css'
import NavBar from '@/components/NavBar';


export default function Login() {
    return (
        <>
        <Head>
            <title>air kitchen</title>
            <meta name="description" content="Order management for catering" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <NavBar title='Login' />
        <main className={CommonStyles.main}>
            <div className={CommonStyles.content}>
                <LoginForm/>
            </div>
        </main>
        </>
    )
}