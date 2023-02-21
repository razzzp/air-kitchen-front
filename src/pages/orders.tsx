import Order from '@/components/Order';
import AuthHandler from '@/lib/auth/AuthHandler';
import AirKitchenClient, {IOrder} from '@/lib/clients/AirKitchenClient';
import {useEffect, useState} from 'react';
import CommonStyles from '@/styles/Common.module.css';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { setFromPathCookie } from '@/lib/utils';
import OrderDetails from '@/components/OrderDetails';
import css from 'styled-jsx/css';

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
                // set 
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
    
    return (
        <>
        <Head>
            <title>air kitchen</title>
            <meta name="description" content="Order management for catering" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={CommonStyles.main} >
            <div>For Buttons</div>
            <div className={CommonStyles['split-column']}>
                <div className={CommonStyles.list}>
                {
                    (state.orders) ? state.orders.map((curOrder)=>{
                        return (
                            <div key={curOrder.id} onClick={()=>setState({orders: state.orders, selectedOrder:curOrder})}>
                                <Order key={curOrder.id} order={curOrder} />
                            </div>
                        )
                    }) : null
                }
                </div>
                <div>
                {
                    (state.selectedOrder) ? <OrderDetails order={state.selectedOrder}/> : null
                }
                </div>
            </div>            
        </main>
        </>
    )
}