import React, { useState } from "react";

import style from './Keyboard.module.css'
import { ReactComponent as BackArrow } from '../../img/icon/backspace.svg';
import { ReactComponent as CloseBtn } from '../../img/icon/cross.svg';
import Modal from "../UI/modal/Modal";

const Keyboard = ({ onClick, getSmaller=()=>{}, sliceEnd, cleanValue }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [openKeyBoard, setOpenKeyBoard] = useState(true)

    const keyBoardHandler = () => {
        setOpenKeyBoard(state => !state)
        getSmaller()
    }

    const openModalHandler = () => {
        setIsOpen(true)
    }

    const closeModalHandler = () => {
        setIsOpen(false)
    }

    const ifOpenStyle = !openKeyBoard ? `${style.closed}` : '';

    return <section className={`${style.keyBoard} ${ifOpenStyle}`}>
        <div className={`pcHidden ${style.toggleBtn}`} onClick={keyBoardHandler}></div>
        <ul className={`${style.keyIn}`}>
            <li>
                <button type="button" className={`whiteFont ${style.red}`} onClick={onClick} value="紅">紅</button>
                <button type="button" className={`whiteFont ${style.blue}`} onClick={onClick} value="藍">藍</button>
                <button type="button" onClick={onClick} value="1">1</button>
                <button type="button" onClick={onClick} value="2">2</button>
                <button type="button" onClick={onClick} value="3">3</button>
            </li>
            <li>
                <button type="button" className={`whiteFont ${style.brown}`} onClick={onClick} value="棕">棕</button>
                <button type="button" className={`whiteFont ${style.green}`} onClick={onClick} value="綠">綠</button>
                <button type="button" onClick={onClick} value="4">4</button>
                <button type="button" onClick={onClick} value="5">5</button>
                <button type="button" onClick={onClick} value="6">6</button>
            </li>
            <li>
                <button type="button" className={`whiteFont ${style.yellow}`} onClick={onClick} value="黃">黃</button>
                <button type="button" className={`whiteFont ${style.orange}`} onClick={onClick} value="橘">橘</button>
                <button type="button" onClick={onClick} value="7">7</button>
                <button type="button" onClick={onClick} value="8">8</button>
                <button type="button" onClick={onClick} value="9">9</button>
            </li>
            <li>
                <button type="button" className={style.transparent} onClick={onClick} value="F">F</button>
                <button type="button" className={`whiteFont ${style.darkGrey}`} onClick={openModalHandler}>更多</button>
                <button type="button" onClick={cleanValue} value="C">C</button>
                <button type="button" onClick={onClick} value="0">0</button>
                <button type="button" onClick={sliceEnd}><BackArrow /></button>
            </li>
        </ul>
        <Modal isOpen={isOpen} onClick={closeModalHandler}>
            <section className={style.selection}>
                <div className={`mbHidden ${style.caption}`}>
                    <button type="button" onClick={closeModalHandler}><CloseBtn /></button>
                    <h1 className="mbHidden">更多選項</h1>
                </div>
                <ul className={style.content}>
                    <li>
                        <button type="button" onClick={onClick} value="L">L</button>
                        <button type="button" onClick={onClick} value="JOY">JOY</button>
                        <button type="button" onClick={onClick} value="幹線">幹線</button>
                    </li>
                    <li>
                        <button type="button" onClick={onClick} value="市民">市民</button>
                        <button type="button" onClick={onClick} value="內科">內科</button>
                        <button type="button" onClick={onClick} value="南軟">南軟</button>
                    </li>
                    <li>
                        <button type="button" onClick={onClick} value="花季">花季</button>
                        <button type="button" onClick={onClick} value="貓空">貓空</button>
                        <button type="button" onClick={onClick} value="高鐵">高鐵</button>
                    </li>
                    <li>
                        <button type="button" onClick={onClick} value="其他">其他</button>
                    </li>
                    <li>
                        <button type="button" onClick={closeModalHandler} value="" className="pcHidden">取消</button>
                    </li>
                </ul>
            </section>
        </Modal>
    </section>
}

export default Keyboard;