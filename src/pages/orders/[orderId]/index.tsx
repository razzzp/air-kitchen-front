import OrderDetails from "@/components/OrderDetails";
import AirKitchenClient, { IOrder } from "@/lib/clients/AirKitchenClient";
import { getValidCredentialsOrRedirect } from "@/lib/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import CommonStyles from '@/styles/Common.module.css';
import Link from "next/link";
import AuthHandler from "@/lib/auth/AuthHandler";

interface IViewOrderProps {

}

interface IViewOrderState {
    order: IOrder;
}

export default function ViewOrder(props : IViewOrderProps) {
    const router = useRouter();
    const [state, setState] = React.useState<IViewOrderState>({order: undefined})
    React.useEffect(()=>{
        (async () =>{
            if(!router.isReady) return;
            const creds = await getValidCredentialsOrRedirect(router);

            const {orderId} = router.query;
            if(typeof orderId !== 'string') return router.push('/404');
            const order = await AirKitchenClient.retrieveOrder(orderId, {token: creds.accessToken});
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
            <nav className={CommonStyles.navbar}>
                <div className={CommonStyles['navbar-button']}><h3>Nav</h3></div>
                <div className={CommonStyles['navbar-remainder']}>
                    <h3>Orders</h3>
                </div>
                <div className={CommonStyles['navbar-action-button']}><h3><Link href={`/orders/${state.order.id}/edit`}>Edit</Link></h3>
                </div>
            </nav>
            <main className={CommonStyles.main}>
                <OrderDetails order={state.order} />
            </main>
    </>
    else return <div></div>;
}