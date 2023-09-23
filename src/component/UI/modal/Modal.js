import React from "react";
import ReactDOM from "react-dom";

import style from './Modal.module.css';

const Modal = ({isOpen,children,onClick}) => {
    if(!isOpen) return null

    return ReactDOM.createPortal(<div className={style.modal} onClick={onClick}>
        {children}
    </div>, document.getElementById("modal"))
}

export default Modal;