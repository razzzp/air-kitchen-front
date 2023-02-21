import { IOrder } from "@/lib/clients/AirKitchenClient";
import React from "react";
import Card from "./Card";

interface IOrderDetailsProps {
    order: IOrder
}

export default class OrderDetails extends React.Component<IOrderDetailsProps> {

    /**
     *
     */
    constructor(props: IOrderDetailsProps) {
        super(props);
    }

    componentDidMount(): void {
        
    }

    componentWillUnmount(): void {
        
    }

    render(): React.ReactNode {
        return (
        <>
            <Card>
                <h2>{this.props.order.name}</h2>
                <p>{this.props.order.desc}</p>
                <p>Status: {this.props.order.status}</p>
                <p>Sale Price: {this.props.order.salePrice}</p>
            </Card>
        </>
        )
    }
}