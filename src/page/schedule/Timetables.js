import React from 'react'

import style from './Timetables.module.css'

import Modal from '../../component/UI/modal/Modal';
import { ReactComponent as CloseBtn } from '../../img/icon/cross.svg';

const convertDayLanguage = {
    'Monday': '一',
    'Tuesday': '二',
    'Wednesday': '三',
    'Thursday': '四',
    'Friday': '五',
    'Saturday': '六',
    'Sunday': '日'
}

const dayType = [{
    'type': '假日',
    'day': ['六', '日']
}, {
    'type': '平日',
    'day': ['一', '二', '三', '四', '五']
}]

const Table = ({ isOpen, road, schedule, closeModalHandler }) => {
    const Sheets = schedule.map((sheet) => {
        const serviceDay = []
        let sheetTitle = ''
        let ifDayTypeEq = false
        let tmpSheetTitle = ''
        let ifServiceDayEq = false

        for (let key in sheet.ServiceDay) {
            if (sheet.ServiceDay[key] === 1) {
                let date = convertDayLanguage[key]
                serviceDay.push(date)
            }
        }

        for (let obj of dayType) {
            ifDayTypeEq = obj['day'].every(d => serviceDay.indexOf(d) !== -1)
            if (ifDayTypeEq) {
                tmpSheetTitle = obj['type']
                break
            }
        }

        if (tmpSheetTitle) {
            const [tmpDayType] = dayType.filter(d => d['type'] === tmpSheetTitle)
            ifServiceDayEq = serviceDay.every(d => tmpDayType['day'].indexOf(d) !== -1)
        }

        if (ifServiceDayEq) {
            sheetTitle = tmpSheetTitle
        }

        if (sheetTitle.length === 0) {
            sheetTitle = serviceDay.join('、')
        }

        const timeHeader = sheet.Direction.map((t,i) =>{
            return <th key={i}>{`往 ${t}`}</th>
        })

        const Time = sheet.Time.map((t, i) => {
            const tData = t.map((data,idx) =>{
                return <td key={`${i}-${idx}`}><div>{data}</div></td>
            })

            return <tr key={i}>
                {tData}
            </tr>
        })

        return <table className={style.sheet} key={`${sheetTitle}`}>
            <caption className={style.sheetTitle}>{sheetTitle}</caption>
            <tbody>
                <tr>
                    {timeHeader}
                </tr>
                {Time}
            </tbody>
        </table>
    })

    return <Modal isOpen={isOpen} onClick={closeModalHandler} >
        <section className={style.table}>
            <div className={`mbHidden ${style.tableHeader}`}>
                <button type="button" onClick={closeModalHandler}><CloseBtn /></button>
                <h2 className={style.tableTitle}>{`${road}班次表`}</h2>
            </div>
            <section className={style.sheetContainer}>
                {Sheets}
            </section>
        </section>
    </Modal>
}

export default Table