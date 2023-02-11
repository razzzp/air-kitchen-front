import HomeStyles from '@/styles/Home.module.css';

interface ICardProps{
    children: any
}

export default function Card(props: ICardProps){
    return (
        <div className={HomeStyles.card}>
            {props.children}
        </div>
    );
}

