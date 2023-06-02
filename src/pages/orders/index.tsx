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

interface IOrdersState {
    orders : Array<IOrder>;
    selectedOrder: IOrder;
}

export default function Orders() {
    const initalState : IOrdersState= {orders: null, selectedOrder:null};
    const [state, setState] = useState(initalState);
    const router = useRouter();
    useEffect(()=>{
        (async () => {
            if(!router.isReady) return;
            const creds = await getValidCredentialsOrRedirect(router);


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
        <NavBar title='Orders'/>
        <main className={CommonStyles.main} >
            <div className={CommonStyles.content}>
                <div className={CommonStyles['button-container']}>
                    <button onClick={newOrderOnClick} className={ButtonStyles['button-38']}>New Order</button>
                </div>
                <div className={CommonStyles.list}>
                {
                    (state.orders) ? state.orders.map((curOrder)=>{
                        return (
                            <div key={curOrder.id} onClick={buildOrderOnClick<HTMLDivElement>(curOrder.id,router)}>
                                <OrderSummary key={curOrder.id} order={curOrder} />
                            </div>
                        )
                    }) : null
                }
                </div>
            </div>
        </main>
        </>
    )
}