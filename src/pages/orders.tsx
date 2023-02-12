import Order from '@/components/Order';
import AuthHandler from '@/lib/auth/AuthHandler';
import AirKitchenClient, {IOrder} from '@/lib/clients/AirKitchenClient';
import {useEffect, useState} from 'react';
import HomeStyles from '@/styles/Common.module.css';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Cookies from 'universal-cookie';
import { setFromPathCookie } from '@/lib/utils';

interface IOrdersProps {
    orders : Array<IOrder>
}

export default function Orders(){
    const initalState : IOrdersProps= {orders: null};
    const [state, setState] = useState(initalState);
    const router = useRouter();
    useEffect(()=>{
        (async () => {
            const creds = await AuthHandler.getValidCredentials();
            if(!creds) {
                // set 
                setFromPathCookie(router.asPath);
                return router.push('/login');
            }

            if(state.orders) return;
            
            const listOfOrders = await AirKitchenClient.retrieveOrders({token: creds.accessToken});
            if (!listOfOrders) return;
            setState({
                orders: listOfOrders
            })
        })();

    });
    
    return (
        <>
        <Head>
            <title>air kitchen</title>
            <meta name="description" content="Order management for catering" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={HomeStyles.main} >
            {
                (state.orders) ? state.orders.map((curOrder)=>{
                    return <Order key={curOrder.id} order={curOrder} />
                }) : null
            }
        </main>
        </>
    )
}