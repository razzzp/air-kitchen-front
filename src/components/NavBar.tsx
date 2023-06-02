import CommonStyles from '@/styles/Common.module.css'

export interface INavBarProps {
    title: string;
}

export default function NavBar(props: INavBarProps){
    return(
    <>
    <nav className={CommonStyles.navbar}>
            <div className={CommonStyles['navbar-section']}><div className={CommonStyles['navbar-button']}><h3>Nav</h3></div></div>
            <div className={CommonStyles['navbar-section']}><div className={CommonStyles['navbar-title']}><h3>{props.title}</h3></div></div>
            <div className={CommonStyles['navbar-section']}></div>
    </nav>
    </>
    )
}