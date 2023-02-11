import Order from '@/components/Order';
import AuthHandler from '@/lib/auth/AuthHandler';
import AirKitchenClient, {IOrder} from '@/lib/clients/AirKitchenClient';
import {useEffect, useState, useRef} from 'react';
import HomeStyles from '@/styles/Home.module.css';

interface IOrdersProps {
    orders : Array<IOrder>
}

export default function Orders(){
    const initalState : IOrdersProps= {orders: null};
    const [state, setState] = useState(initalState);

    useEffect(()=>{
        if(state.orders) return;
        
        const cred = AuthHandler.getCredentials();
        if (!cred) return;
        (async () => {
            const listOfOrders = await AirKitchenClient.retrieveOrders({token: cred.accessToken});
            if (!listOfOrders) return;
            setState({
                orders: listOfOrders
            })
        })();

    });
    
    return (
        <>
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