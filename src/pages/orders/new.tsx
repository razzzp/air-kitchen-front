import NavBar from "@/components/NavBar";
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
    <NavBar title="Orders"/>
    <main className={CommonStyles.main}>
        <div className={CommonStyles.content}>
            <OrderForm order={newOrder} />
        </div>
    </main>
    </>
}