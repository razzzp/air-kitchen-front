import { IOrder } from "@/lib/clients/AirKitchenClient";
import Card from "./Card";
import CommonStyles from '@/styles/Common.module.css';
import ButtonStyles from '@/styles/Button.module.css'
import { useRouter } from "next/router";
import { MouseEvent } from "react";


export interface IOrderDetailsProps {
    order: IOrder
}

function _penniesToDollars(pennies: string) {
    return `$${BigInt(pennies) / BigInt(100)}.${(BigInt(pennies) % BigInt(100)).toString().padStart(2,'0')}`;
}



export default function OrderDetails(props: IOrderDetailsProps) {
    const router = useRouter()

    const editOrder = function(e: MouseEvent<HTMLButtonElement>){
        return router.push(`/orders/${props.order.id}/edit`)
    }

    return <>
            <div>
                <h2>{props.order.name}</h2>
                <p>{props.order.desc}</p>
                <p>Due Date: {props.order.dueDate ? props.order.dueDate.toDateString():'None'}</p>
                <p>Status: {props.order.status}</p>
                <p>Sale Price: {_penniesToDollars(props.order.salePrice)}</p>
                <div className={CommonStyles['button-container']}>
                    <button type="button" className={ButtonStyles['button-38']} onClick={editOrder}>Edit</button>
                </div>
            </div>
        </>;
}