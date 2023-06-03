import { IOrder } from "@/lib/clients/AirKitchenClient";
import { NextRouter, useRouter } from "next/router";
import { MouseEventHandler, useState, MouseEvent } from "react";
import CommonStyles from "@/styles/Common.module.css";
import OrderSummary from "./OrderSummary";
import { EOrderStatus } from "@/lib/clients/AirKitchenClient";

interface IOrderBrowserProps{

}

interface IOrderBrowserState {
    orders : Array<IOrder>;
    selectedOrder: IOrder;
    filters: IOrderBrowserFilter;
}

interface IOrderBrowserFilter{
    status : EOrderStatus;
    title : string;
    
}

function _buildInitialFilter() : IOrderBrowserFilter{
    return {
        status: EOrderStatus.Pending,
        title: '',
    }
}

export default function OrderBrowser(props: IOrderBrowserProps) {
    const initalState : IOrderBrowserState= {orders: null, selectedOrder:null, filters: _buildInitialFilter()};
    const [state, setState] = useState(initalState);
    const router = useRouter();

    const viewOrderOnClick =  <T = Element>(orderId: number, router: NextRouter) : MouseEventHandler<T> => {
        return (e: MouseEvent<T>) => {
            return router.push(`/orders/${orderId}`);
        };
    }

    return (<div className={CommonStyles.list}>
        {
            (state.orders) ? state.orders.map((curOrder)=>{
                return (
                    <div key={curOrder.id} onClick={viewOrderOnClick<HTMLDivElement>(curOrder.id,router)}>
                        <OrderSummary key={curOrder.id} order={curOrder} />
                    </div>
                )
            }) : null
        }
        </div>
    );
}