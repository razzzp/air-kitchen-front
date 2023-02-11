import { EOrderStatus, IOrder } from "@/lib/clients/AirKitchenClient";
import React from "react";
import Card from "./Card";


interface IOrderProps {
    order: IOrder;
}

export default class Order extends React.Component<IOrderProps> {
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
                <h1>{this.props.order.name}</h1>
                <p>{this.props.order.desc}</p>
                <p>Status: {this.props.order.status}</p>
                <p>Sale Price: {this.props.order.salePrice}</p>
            </Card>
            </>
        )
    }
}