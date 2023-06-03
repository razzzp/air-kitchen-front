import OrderSummary from '@/components/OrderSummary';
import AuthHandler from '@/lib/auth/AuthHandler';
import AirKitchenClient, {IOrder} from '@/lib/clients/AirKitchenClient';
import {MouseEvent, MouseEventHandler, useEffect, useState} from 'react';
import CommonStyles from '@/styles/Common.module.css';
import ButtonStyles from "@/styles/Button.module.css";
import Head from 'next/head';
import { NextRouter, useRouter } from 'next/router';
import { getValidCredentialsOrRedirect, setFromPathCookie } from '@/lib/utils';
import NavBar from '@/components/NavBar';
import OrderBrowser from '@/components/OrderBrowser';

export default function Orders() {
    const router = useRouter(); 

    const newOrderOnClick = () => {
        router.push('/orders/new')
    }

    return (
        <>
        <Head>
            <title>air kitchen</title>
            <meta name="description" content="Order management for catering" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <NavBar title='Orders'/>
        <main className={CommonStyles.main} >
            <div className={CommonStyles.content}>
                <div className={CommonStyles['button-container']}>
                    <button onClick={newOrderOnClick} className={ButtonStyles['button-38']}>New Order</button>
                </div>
                <OrderBrowser />
            </div>
        </main>
        </>
    )
}