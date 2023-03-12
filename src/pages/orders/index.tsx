import OrderSummary from '@/components/OrderSummary';
import AuthHandler from '@/lib/auth/AuthHandler';
import AirKitchenClient, {IOrder} from '@/lib/clients/AirKitchenClient';
import {MouseEvent, MouseEventHandler, useEffect, useState} from 'react';
import CommonStyles from '@/styles/Common.module.css';
import ButtonStyles from "@/styles/Button.module.css";
import Head from 'next/head';
import { NextRouter, useRouter } from 'next/router';
import { setFromPathCookie } from '@/lib/utils';

interface IOrdersState {
    orders : Array<IOrder>;
    selectedOrder: IOrder;
}

export default function Orders(){
    const initalState : IOrdersState= {orders: null, selectedOrder:null};
    const [state, setState] = useState(initalState);
    const router = useRouter();
    useEffect(()=>{
        (async () => {
            const creds = await AuthHandler.getValidCredentials();
            if(!creds) {
                // set creds
                setFromPathCookie(router.asPath);
                return router.push('/login');
            }

            if(state.orders) return;
            
            const listOfOrders = await AirKitchenClient.retrieveOrders({token: creds.accessToken});
            if (!listOfOrders) return;
            setState({
                orders: listOfOrders,
                selectedOrder: listOfOrders.length > 0 ? listOfOrders[0] : null
            })
        })()
        .then(()=>console.log('Orders loaded.'))
        .catch((e)=>console.error(e));

    });

    const newOrderOnClick = () => {
        router.push('/orders/new')
    }
    
    const buildOrderOnClick =  <T = Element>(orderId: number, router: NextRouter) : MouseEventHandler<T> => {
        return (e: MouseEvent<T>) => {
            return router.push(`/orders/${orderId}`);
        };
    }

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
            <div className={CommonStyles['navbar-remainder']}><h3>Orders</h3></div>
        </nav>
        <main className={CommonStyles.main} >
            <div className={CommonStyles['button-container']}>
                <button onClick={newOrderOnClick} className={ButtonStyles['button-38']}>New Order</button>
            </div>
            <div className={CommonStyles.list}>
            {
                (state.orders) ? state.orders.map((curOrder)=>{
                    return (
                        // TODO implement on click
                        <div key={curOrder.id} onClick={buildOrderOnClick<HTMLDivElement>(curOrder.id,router)}>
                            <OrderSummary key={curOrder.id} order={curOrder} />
                        </div>
                    )
                }) : null
            }
            </div>
        </main>
        </>
    )
}