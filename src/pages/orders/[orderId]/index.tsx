import OrderDetails from "@/components/OrderDetails";
import AirKitchenClient, { IOrder, getAirKitchenClient } from "@/lib/clients/AirKitchenClient";
import { getValidCredentialsOrRedirect } from "@/lib/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import CommonStyles from '@/styles/Common.module.css';
import Link from "next/link";
import AuthHandler from "@/lib/auth/AuthHandler";
import NavBar from "@/components/NavBar";

interface IViewOrderProps {

}

interface IViewOrderState {
    order: IOrder;
}

export default function ViewOrder(props : IViewOrderProps) {
    const router = useRouter();
    const [state, setState] = React.useState<IViewOrderState>({order: undefined})
    const client = getAirKitchenClient();
    React.useEffect(()=>{
        (async () =>{
            if(!router.isReady) return;
            const creds = await getValidCredentialsOrRedirect(router);

            const {orderId} = router.query;
            if(typeof orderId !== 'string') return router.push('/404');
            const order = await client.getOrder(orderId, {token: creds.accessToken});
            return setState({order: order});
        })();
    }, [router, router.isReady]);
    

    if (state.order) return  <>
            <Head>
                <title>air kitchen</title>
                <meta name="description" content="Order management for catering" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <NavBar title="Orders" />
            <main className={CommonStyles.main}>
                <div className={CommonStyles.content}>
                    <OrderDetails order={state.order} />    
                </div>
            </main>
    </>
    else return <div></div>;
}