import React from 'react'
import { Link, useLocation } from 'react-router-dom';

import style from './Breadcrumbs.module.css';

const urlTable = {
    bus:'公車動態',
    nearby:'附近站點',
    schedule:'班表查詢',
    collection:'我的收藏'
}

const Breadcrumbs = (props) => {
    const location = useLocation();
    const secondLink = location.pathname.split('/')[1];

    return (
        <ul className={`${props.className} ${style.breadcrumbs}`}>
            <li><Link to="/">首頁</Link></li>
            <li><Link to={`/${secondLink}`}>{urlTable[secondLink]}</Link></li>
        </ul>
    )
}

export default Breadcrumbs
