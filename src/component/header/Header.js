import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'

import style from './Header.module.css'
import { ReactComponent as Menu } from '../../img/icon/menu.svg'
import { ReactComponent as Cross } from "../../img/icon/cross.svg";

const Header = ({ className, children, pathName }) => {
    const [mbNavOpen, setMbNavOpen] = useState(false);
    const [nowTab, setNowTab] = useState('');
    let isTabBus, isTabNearby, isTabSchedule, isTabCollection = '';

    className = !!className ? className : '';

    const mbNavHandler = () => {
        setMbNavOpen(state => !state)
    }

    useEffect(() => {

        setNowTab(pathName)

    }, [pathName])
    
    const navClass = `${style.nav} ${!!mbNavOpen ? style.openNav:''}`

    if(nowTab === '/bus') isTabBus = style.activeLink
    if(nowTab === '/nearby') isTabNearby = style.activeLink
    if(nowTab === '/schedule') isTabSchedule = style.activeLink
    if(nowTab === '/collection') isTabCollection = style.activeLink

    return <section>
        <header className={`${style.header} ${className}`}>
            <h1><Link to="/">Hello,Bus!</Link></h1>
            <button className={`pcHidden ${style.navSwitcherBtn}`} onClick={mbNavHandler}>
                {mbNavOpen ? <Cross /> : <Menu />}
            </button>
            <nav className={navClass}>
                <Link className={`${isTabBus}`} to="/bus">公車動態</Link>
                <Link className={`${isTabNearby}`} to="/nearby">附近站點</Link>
                <Link className={`${isTabSchedule}`} to="/schedule">班表查詢</Link>
                <Link className={`${isTabCollection}`} to="/collection">我的收藏</Link>
            </nav>
        </header>
        {children}
    </section>

}

export default Header;