import { IOrder } from "@/lib/clients/AirKitchenClient";
import Card from "./Card";


export interface IOrderDetailsProps {
    order: IOrder
}

function _penniesToDollars(pennies: string) {
    return `$${BigInt(pennies) / BigInt(100)}.${(BigInt(pennies) % BigInt(100)).toString().padStart(2,'0')}`;
}



export default function OrderDetails(props: IOrderDetailsProps) {
    return <>
            <div>
                <h2>{props.order.name}</h2>
                <p>{props.order.desc}</p>
                <p>Due Date: {props.order.dueDate ? props.order.dueDate.toDateString():'None'}</p>
                <p>Status: {props.order.status}</p>
                <p>Sale Price: {_penniesToDollars(props.order.salePrice)}</p>
            </div>
        </>;
}