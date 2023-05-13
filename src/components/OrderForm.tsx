import { ChangeEvent, FormEvent, useState } from "react";
import { IOrderProps } from "./OrderSummary";
import FormStyles from '@/styles/Form.module.css';
import ButtonStyles from "@/styles/Button.module.css";
import AirKitchenClient, { EOrderStatus, IOrder } from "@/lib/clients/AirKitchenClient";
import AuthHandler from "@/lib/auth/AuthHandler";
import { setFromPathCookie } from "@/lib/utils";
import { useRouter } from "next/router";

interface IOrderFormState{
    order: IOrder;
}

export default function OrderForm(props: IOrderProps){
    const [state, setState] = useState<IOrderFormState>({order: props.order});
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
            if(state.order.id){
                // has id so perform put
                const orderToPut = AirKitchenClient.buildOrderForPut(state.order);
                const savedOrder = AirKitchenClient.putOrder(orderToPut, {token: creds.accessToken});
                console.log(savedOrder);
                return router.push(`/orders/${orderToPut.id}`);
            } else {
                // else new order do post
                const orderToPost = AirKitchenClient.buildOrderForPost(state.order);
                const savedOrder = AirKitchenClient.postNewOrder(orderToPost, {token: creds.accessToken});
                console.log(savedOrder);
                return router.push('/orders');
            }
        } catch (error) {
            console.log(error);
        }
    } 



    const onOrderChange = (e: ChangeEvent<HTMLElement>)=> {
        if (e.target instanceof HTMLTextAreaElement){
            const newOrderPartial : {[key:string]: string}= {};
            newOrderPartial[e.target.name] = e.target.value;
            const targetOrder = {...state.order, ...newOrderPartial}
            return setState({order:targetOrder});
        } else if (e.target instanceof HTMLInputElement){
            const newOrderPartial : {[key:string]: string}= {};
            newOrderPartial[e.target.name] = e.target.value;
            const targetOrder = {...state.order, ...newOrderPartial}
            return setState({order:targetOrder});
        } else if (e.target instanceof HTMLSelectElement){
            const newOrderPartial : {[key:string]: string}= {};
            newOrderPartial[e.target.name] = e.target.value;
            const targetOrder = {...state.order, ...newOrderPartial}
            return setState({order:targetOrder});
        }
    }

    return <>
        <div>
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
                            value={state.order.name}
                            required />
                        </div>
                    </div>
                    <div className={FormStyles['form-field-group']}>
                        <label>Description:</label>
                        <div>
                            <textarea 
                            name="desc" 
                            className="form-control" 
                            onChange={onOrderChange}
                            value={state.order.desc}></textarea>
                        </div>
                    </div>
                    <div className={FormStyles['form-field-group']}>
                        <label>Status:</label>
                        <div>
                            <select name="status" value={state.order.status} onChange={onOrderChange}>
                                {
                                Object.values(EOrderStatus).map((val)=>{
                                    return <option key={val} value={val}>{val}</option>
                                })
                                }
                            </select>
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
                            value={state.order.salePrice}
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
        </div>
    </>
}