import { IOrder } from "@/lib/clients/AirKitchenClient";
import Card from "./Card";
import CommonStyles from '@/styles/Common.module.css';
import ButtonStyles from '@/styles/Button.module.css'
import { useRouter } from "next/router";
import { MouseEvent } from "react";
import OrderDetailsStyles from "@/styles/OrderDetails.module.css";


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
            <div className={OrderDetailsStyles['view-container']}>
                <h2>{props.order.name}</h2>
                <p>{props.order.desc}</p>
                <div className={OrderDetailsStyles['field-group']}>
                    <div className={OrderDetailsStyles['field-label']}>Status:</div>
                    <div className={OrderDetailsStyles['field-value']}>{props.order.status}</div>
                </div>
                <div className={OrderDetailsStyles['field-group']}>
                    <div className={OrderDetailsStyles['field-label']}>Due Date:</div>
                    <div className={OrderDetailsStyles['field-value']}>{props.order.dueDate ? props.order.dueDate.toDateString():'None'}</div>
                </div>
                <div className={OrderDetailsStyles['field-group']}>
                    <div className={OrderDetailsStyles['field-label']}>Sale Price:</div>
                    <div className={OrderDetailsStyles['field-value']}>{_penniesToDollars(props.order.salePrice)}</div>
                </div>
                <div className={OrderDetailsStyles['button-container']}>
                    <button type="button" className={ButtonStyles['button-38']} onClick={editOrder}>Edit</button>
                </div>
            </div>
        </>;
}