import React from "react";

import style from './Switch.module.css';

const Switch = ({ className, onClick }) => {

    return <div className={className}>
        <label class={`${style.switch}`} onClick={onClick}>
            <input type="checkbox" />
            <span class={`${style.slider}`}></span>
        </label>
    </div>
}

export default Switch;