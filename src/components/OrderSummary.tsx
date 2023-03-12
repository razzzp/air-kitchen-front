import { EOrderStatus, IOrder } from "@/lib/clients/AirKitchenClient";
import React from "react";
import Card from "./Card";


export interface IOrderProps {
    order: IOrder;
}

export default class OrderSummary extends React.Component<IOrderProps> {
    constructor(props: IOrderProps) {
        super(props);
    }

    private _getStatusAsString(status: EOrderStatus) : string{
        if (status as EOrderStatus === EOrderStatus.Pending){
            return 'Pending';
        } else if (status as EOrderStatus === EOrderStatus.InProgress) {
            return 'In Progress';
        } else if (status as EOrderStatus === EOrderStatus.Done) {
            return 'Done';
        } else if (status as EOrderStatus === EOrderStatus.Cancelled) {
            return 'Cancelled';
        }
        return '';
    }

    render(): React.ReactNode {
        return (
            <>
            <Card>
                <h2>{this.props.order.name}</h2>
                <p>Status: {this.props.order.status}</p>
            </Card>
            </>
        )
    }
}