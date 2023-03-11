import OrderForm from "@/components/OrderForm";
import AirKitchenClient, { getAirKitchenClient } from "@/lib/clients/AirKitchenClient";
import CommonStyles from '@/styles/Common.module.css';
import Head from "next/head";


export default function NewOrder(){
    const newOrder = AirKitchenClient.buildNewOrder();
    return <>
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
    <main className={CommonStyles.main}>
        <OrderForm order={newOrder} />
    </main>
    </>
}