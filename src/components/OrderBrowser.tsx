import AirKitchenClient, { IOrder, getAirKitchenClient } from "@/lib/clients/AirKitchenClient";
import { NextRouter, useRouter } from "next/router";
import { MouseEventHandler, useState, MouseEvent, useEffect, SetStateAction } from "react";
import CommonStyles from "@/styles/Common.module.css";
import OrderSummary from "./OrderSummary";
import { EOrderStatus } from "@/lib/clients/AirKitchenClient";
import { TReactSetStateFunction, getValidCredentialsOrRedirect } from "@/lib/utils";
import OrderBrowserStyles from "@/styles/OrderBrowser.module.css";
import Orders from "@/pages/orders";

interface IOrderBrowserProps{

}

interface IOrderBrowserState{
    orders?: IOrder[];
    filters: IOrderBrowserFilter;
}

interface IOrderBrowserFilter{
    id? : number;
    title? : string;
    status? : EOrderStatus;
}

function _buildInitialFilter() : IOrderBrowserFilter{
    return {
        status: EOrderStatus.Pending,
        title: '',
    }
}

async function _getNewOrders(
    filters: IOrderBrowserFilter,
    router: NextRouter, 
    client: AirKitchenClient
    ){
    if(!router.isReady) return;
    const creds = await getValidCredentialsOrRedirect(router);

    const listOfOrders = await client.getOrders({token: creds.accessToken}, filters);
    return listOfOrders;
}

function _classesForTab(forTab: EOrderStatus, filters:IOrderBrowserFilter){
    return `${OrderBrowserStyles['status-tab']} ${forTab === filters.status ? OrderBrowserStyles['status-tab-selected']: ''}`
}

export default function OrderBrowser(props: IOrderBrowserProps) {
    const [orders, setOrders] = useState<Array<IOrder>>(undefined);
    const [filters, setFilters] = useState<IOrderBrowserFilter>(_buildInitialFilter());
    const router = useRouter();
    const client = getAirKitchenClient();

    useEffect(()=>{
        if(orders) return;
        _getNewOrders(filters, router, client)
            .then((result)=>{
                setOrders(result);
                console.log('Orders loaded.');})
            .catch((e)=>console.error(e));
    });

    const viewOrderOnClick =  <T = Element>(orderId: number, router: NextRouter) : MouseEventHandler<T> => {
        return (e: MouseEvent<T>) => {
            return router.push(`/orders/${orderId}`);
        };
    };

    const generateOnClickForStatusTab = (status : EOrderStatus)=>{
        return (e: MouseEvent)=> {
            const newFilters = {...filters};
            newFilters.status = status;
            setFilters(newFilters);
            _getNewOrders(newFilters, router, client)
                .then((result)=>{
                    setOrders(result);
                    console.log('Orders loaded.');})
                .catch((e)=>console.error(e));
        }
    }

    return (
        <>
        <div className={OrderBrowserStyles['status-tabs-container']}>
            <button className={_classesForTab(EOrderStatus.Pending, filters)} onClick={generateOnClickForStatusTab(EOrderStatus.Pending)}>Pending</button>
            <button className={_classesForTab(EOrderStatus.InProgress, filters)} onClick={generateOnClickForStatusTab(EOrderStatus.InProgress)}><p>In Progress</p></button>
            <button className={_classesForTab(EOrderStatus.Done, filters)} onClick={generateOnClickForStatusTab(EOrderStatus.Done)}><p>Done</p></button>
            <button className={_classesForTab(EOrderStatus.OnHold, filters)} onClick={generateOnClickForStatusTab(EOrderStatus.OnHold)}><p>On Hold</p></button>
            <button className={_classesForTab(EOrderStatus.Cancelled, filters)} onClick={generateOnClickForStatusTab(EOrderStatus.Cancelled)}><p>Cancelled</p></button>
        </div>
        <div className={CommonStyles.list}>
        {
            (orders) ? orders.map((curOrder)=>{
                return (
                    <div key={curOrder.id} onClick={viewOrderOnClick<HTMLDivElement>(curOrder.id,router)}>
                        <OrderSummary key={curOrder.id} order={curOrder} />
                    </div>
                )
            }) : null
        }
        </div>
        </>
    );
}