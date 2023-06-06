import { ChangeEvent, FormEvent, useState } from "react";
import { IOrderSummaryProps } from "./OrderSummary";
import FormStyles from '@/styles/Form.module.css';
import ButtonStyles from "@/styles/Button.module.css";
import CommonStyles from "@/styles/Common.module.css";
import AirKitchenClient, { EOrderStatus, IOrder, getAirKitchenClient } from "@/lib/clients/AirKitchenClient";
import AuthHandler from "@/lib/auth/AuthHandler";
import { getValidCredentialsOrRedirect, penniesToDollars, setFromPathCookie } from "@/lib/utils";
import { useRouter } from "next/router";

interface IOrderForView {
    name: string;
    desc: string;
    status: EOrderStatus;
    salePrice: number;
    dueDate?: Date;
}

interface IOrderFormState{
    order: IOrderForView;
}

interface IOrderFormProps {
    order: IOrder;
}

function parseOrderForm(orderForm: {[key: string]: string}): IOrderForView{
    if(!orderForm) return undefined;
    return {
        name: orderForm.name,
        desc: orderForm.desc,
        status: orderForm.status as EOrderStatus,
        salePrice: Number.parseFloat(orderForm.salePrice),
        dueDate:  orderForm.date? new Date(orderForm.date) : undefined
    };
}

function convertOrderViewToClientObject(orderView : IOrderForView, id: number) : IOrder {
    return {
        id: id,
        name: orderView.name,
        desc: orderView.desc,
        status: orderView.status,
        salePrice: Math.round(orderView.salePrice * 100).toString(),
        dueDate: orderView.dueDate
    };
}

function convertOrderClientObjectToView(order : IOrder) : IOrderForView{
    return {
        name: order.name,
        desc: order.desc,
        status: order.status,
        salePrice: penniesToDollars(order.salePrice),
        dueDate: order.dueDate
    };
}


export default function OrderForm(props: IOrderFormProps){

    const orderForView: IOrderForView = convertOrderClientObjectToView(props.order);
    const [state, setState] = useState<IOrderFormState>({order: orderForView});
    const router = useRouter();
    const client = getAirKitchenClient();
    const onSubmit = async (e: FormEvent)=>{
        e.preventDefault();
        try {
            const creds = await getValidCredentialsOrRedirect(router);
            if(props.order.id){
                // has id so perform put
                const order = convertOrderViewToClientObject(state.order, props.order.id);
                const orderToPut = client.buildOrderForPut(order);
                const savedOrder = await client.putOrder(orderToPut, {token: creds.accessToken});
                console.log(savedOrder);
                return router.push(`/orders/${orderToPut.id}`);
            } else {
                // else new order do post
                const order = convertOrderViewToClientObject(state.order, props.order.id);
                const orderToPost = client.buildOrderForPost(order);
                const savedOrder = await client.postNewOrder(orderToPost, {token: creds.accessToken});
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
            const targetOrder: unknown = {...state.order, ...newOrderPartial}
            return setState({order:parseOrderForm(targetOrder as {[key:string]:string})});
        } else if (e.target instanceof HTMLInputElement){
            const newOrderPartial : {[key:string]: string}= {};
            newOrderPartial[e.target.name] = e.target.value;
            const targetOrder: unknown = {...state.order, ...newOrderPartial}
            return setState({order:parseOrderForm(targetOrder as {[key:string]:string})});
        } else if (e.target instanceof HTMLSelectElement){
            const newOrderPartial : {[key:string]: string}= {};
            newOrderPartial[e.target.name] = e.target.value;
            const targetOrder: unknown = {...state.order, ...newOrderPartial}
            return setState({order:parseOrderForm(targetOrder as {[key:string]:string})});
        }
    }

    const cancelEdit = function(e: FormEvent) {
        if(props.order.id) return router.push(`/orders/${props.order.id}`);
        else return router.push(`/orders`)
    }

    const deleteOrder = async function(e: FormEvent) {
        const creds = await AuthHandler.getValidCredentials();
        const resp = client.deleteOrder(props.order.id.toString(), {token: creds.accessToken});
        return router.push(`/orders`);
    }

    return <>
        <form onSubmit={onSubmit}>
            <div className={FormStyles['form-body']}>
                <div className={FormStyles['form-field-group']}>
                    <label className={FormStyles['form-label']}>Name:</label>
                    <div>
                        <input 
                            type="text" 
                            name="name"
                            className={FormStyles['form-input-text']} 
                            onChange={onOrderChange} 
                            value={state.order.name}
                            required />
                    </div>
                </div>
                <div className={FormStyles['form-field-group']}>
                    <label className={FormStyles['form-label']}>Description:</label>
                    <div>
                        <textarea 
                        name="desc" 
                        className={FormStyles['form-input-textarea']} 
                        onChange={onOrderChange}
                        value={state.order.desc}></textarea>
                    </div>
                </div>
                <div className={FormStyles['form-field-group']}>
                    <label className={FormStyles['form-label']}>Status:</label>
                    <div>
                        <select 
                            name="status" 
                            value={state.order.status} 
                            onChange={onOrderChange}
                            className={FormStyles['form-input-select']}>
                            {
                            Object.values(EOrderStatus).map((val)=>{
                                return <option key={val} value={val}>{val}</option>
                            })
                            }
                        </select>
                    </div>
                </div>
                <div className={FormStyles['form-field-group']}>
                    <label className={FormStyles['form-label']}>Sale Price:</label>
                    <div>
                        <input 
                        type="number" 
                        name="salePrice"
                        step={0.01}
                        min={0}
                        className={FormStyles['form-input-text']} 
                        onChange={onOrderChange} 
                        value={state.order.salePrice}
                        required />
                    </div>
                </div>
                <div className={FormStyles['form-action-container']}>
                    <div className="col-2">
                        <button type="submit" className={ButtonStyles['button-38']}>Save</button>
                    </div>
                    <div>
                        <button type="button" className={ButtonStyles['button-38']} onClick={cancelEdit}>Cancel</button>
                    </div>
                    <div>
                        <button type="button" className={ButtonStyles['button-danger']} onClick={deleteOrder}>Delete</button>
                    </div>
                </div>
            </div>  
        </form>
    </>
}