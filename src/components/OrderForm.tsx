import { ChangeEvent, FormEvent, useState } from "react";
import Card from "./Card";
import { IOrderProps } from "./Order";
import FormStyles from '@/styles/Form.module.css';
import ButtonStyles from "@/styles/Button.module.css";
import AirKitchenClient, { EOrderStatus, IOrder } from "@/lib/clients/AirKitchenClient";
import AuthHandler from "@/lib/auth/AuthHandler";
import { setFromPathCookie } from "@/lib/utils";
import { useRouter } from "next/router";

interface IOrderFormState extends IOrder{

}

export default function OrderForm(props: IOrderProps){
    const [state, setState] = useState<IOrderFormState>(props.order);
    const router = useRouter();
    const onSubmit = async (e: FormEvent)=>{
        e.preventDefault();
        try {
            const creds = await AuthHandler.getValidCredentials();
            if(!creds) {
                // set creds
                setFromPathCookie(router.asPath);
                return router.push('/login');
            }
            const orderToPost = AirKitchenClient.buildOrderToPost(state);
            const savedOrder = AirKitchenClient.postNewOrder(orderToPost, {token: creds.accessToken});
            console.log(savedOrder);
            return router.push('/orders');
        } catch (error) {
            console.log(error);
        }
    }

    const onOrderChange = (e: ChangeEvent<HTMLElement>)=> {
        if (e.target instanceof HTMLTextAreaElement){
            const newStatePartial : {[key:string]: string}= {};
            newStatePartial[e.target.name] = e.target.value;
            return setState({...state, ...newStatePartial});
        } else if (e.target instanceof HTMLInputElement){
            const newStatePartial : {[key:string]: string}= {};
            newStatePartial[e.target.name] = e.target.value;
            return setState({...state, ...newStatePartial});
        }
    }

    return <>
        <Card>
            <form onSubmit={onSubmit}>
                <div className={FormStyles['form-body']}>
                    <div className={FormStyles['form-field-group']}>
                        <label>Name:</label>
                        <div>
                            <input 
                            type="text" 
                            name="name"
                            className="form-control" 
                            onChange={onOrderChange} 
                            value={props.order.name}
                            required />
                        </div>
                    </div>
                    <div className={FormStyles['form-field-group']}>
                        <label>Description</label>
                        <div>
                            <textarea 
                            name="desc" 
                            className="form-control" 
                            onChange={onOrderChange}
                            defaultValue={props.order.desc}></textarea>
                        </div>
                    </div>
                    <div className={FormStyles['form-field-group']}>
                        <label>Status:</label>
                        <div>
                            <input 
                            type="text" 
                            name="status"
                            className="form-control" 
                            onChange={onOrderChange} 
                            value={props.order.status}
                            required />
                        </div>
                    </div>
                    <div className={FormStyles['form-field-group']}>
                        <label>Sale Price:</label>
                        <div>
                            <input 
                            type="text" 
                            name="salePrice"
                            className="form-control" 
                            onChange={onOrderChange} 
                            value={props.order.salePrice}
                            required />
                        </div>
                    </div>
                    <div className={FormStyles['form-field-group']}>
                        <div className="col-2">
                            <button type="submit" className={ButtonStyles['button-38']}>Save</button>
                        </div>
                    </div>
                </div>  
            </form>
        </Card>
    </>
}