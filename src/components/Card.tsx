import CommonStyles from '@/styles/Common.module.css';

interface ICardProps{
    children: any
}

export default function Card(props: ICardProps){ 
    return (
        <div className={CommonStyles.card}>
            {props.children}
        </div>
    );
}

