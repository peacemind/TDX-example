import React from "react";

import style from './ResultImg.module.css';
import Search from '../../img/search.png';
import NotFound from '../../img/notFound.png'


const ResultImg = ({state, text=''}) => {
    state = !!state ? Search : NotFound; 

    return <figure className={`${style.image}`}>
    <img  src={state} alt={text} />
    <figcaption>{text}</figcaption>
</figure>
}

export default ResultImg;