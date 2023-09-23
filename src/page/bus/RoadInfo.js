import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';

import Header from '../../component/header/Header';
import Breadcrumbs from '../../component/UI/breadcrumbs/Breadcrumbs';
import Footer from '../../component/footer/Footer';
import Timetables from '../schedule/Timetables'
import Modal from '../../component/UI/modal/Modal';
import { ReactComponent as Location } from '../../img/icon/locationArrow.svg';
import { ReactComponent as Time } from '../../img/icon/time.svg';
import { ReactComponent as BackArrow } from '../../img/icon/backArrow.svg';
import { ReactComponent as TwoWayArrow } from '../../img/icon/twoWayArrow.svg';
import { ReactComponent as Exchange } from '../../img/icon/exchange.svg';
import useFetch from '../../hook/useFetch';
import Switch from '../../component/UI/switch/Switch';

import style from './RoadInfo.module.css';

const RoadInfo = (props) => {
    const history = useHistory()
    const location = useLocation()
    const { city, uid } = useParams();
    const [routeDirection, setRouteDirection] = useState(0)
    const [stops, setStops] = useState([])
    const [busNearby, setBusNearby] = useState([])
    const [isOpen, setIsOpen] = useState()
    const [alertOpen, setAlertOpen] = useState(false)
    const [schedule, setSchedule] = useState([])
    const [loading, fetchData] = useFetch(false)

    let stopList = []

    const backPreviousPageHandler = () =>{
        history.replace('/bus')
    }

    const stopDirectionHandler = () => {
        setRouteDirection(state => state === 0 ? 1 : 0)
    }

    const openModalHandler = () => {
        if (city !== 'Taoyuan') {
            setIsOpen(false)
            setAlertOpen(true)
        } else {
            setIsOpen(true)
        }

    }

    const closeModalHandler = () => {
        setIsOpen(false)
    }

    const alertHandler = () => {
        setAlertOpen(alertOpen => !alertOpen)
    }

    // get bus stop/ bus location/ stop time
    useEffect(() => {
        const busNearbyURL = `https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeNearStop/City/${city}/?%24select=PlateNumb%2CDirection%2CStopUID%2CStopSequence%2CBusStatus%2CStopName%2CA2EventType&%24filter=RouteUID%20eq%20'${uid}'%20and%20Direction%20eq%20${routeDirection}&%24format=JSON`;
        const applyBusNearby = (data) => {
            setBusNearby(data)
        }
        const stopTimeURL = `https://ptx.transportdata.tw/MOTC/v2/Bus/EstimatedTimeOfArrival/City/${city}?%24select=StopUID%2CStopName%2CEstimateTime%2CStopStatus&%24filter=RouteUID%20eq%20'${uid}'%20and%20Direction%20eq%20${routeDirection}&%24format=JSON`
        const applyStopTime = (data) => {
            setStops(state => {
                const newState = state.map(stop => {
                    const [stopData] = data.filter(obj => obj.StopUID === stop.StopUID)
                    return {
                        ...stop,
                        EstimateTime: stopData.EstimateTime,
                        StopStatus: stopData.StopStatus
                    }
                })

                return newState
            })
        }

        const stopsURL = `https://ptx.transportdata.tw/MOTC/v2/Bus/StopOfRoute/City/${city}?%24select=RouteUID%2CRouteName%2CDirection%2CStops&%24filter=RouteUID%20eq%20'${uid}'%20and%20Direction%20eq%20${routeDirection}&%24format=JSON`
        const applyStops = (data) => {
            const [stopsData] = data
            setStops(stopsData.Stops)

            fetchData(busNearbyURL, applyBusNearby)
            fetchData(stopTimeURL, applyStopTime)
        }

        fetchData(stopsURL, applyStops)


    }, [city, uid, routeDirection, fetchData])

    // get schedule
    useEffect(() => {
        // 目前僅提供桃園市資料查詢
        let url = `https://ptx.transportdata.tw/MOTC/v2/Bus/Schedule/City/${city}/${location.state.road}?%24select=Direction%2CTimetables&%24filter=RouteUID%20eq%20'${uid}'&%24format=JSON`

        const applySchedule = (data) => {
            const sheet = []

            for (let i = 0; i < data.length; i++) {
                const { Direction, Timetables } = data[i]

                for (let j = 0; j < Timetables.length; j++) {
                    let [sheetLength, TimeLocation] = Timetables[j].TripID.split('-')
                    sheetLength = parseInt(sheetLength, 10)
                    TimeLocation = parseInt(TimeLocation, 10)

                    if (sheet[sheetLength - 1] === undefined) {
                        sheet[sheetLength - 1] = {
                            ServiceDay: [],
                            Direction: [],
                            Time: []
                        }
                    }

                    if (sheet[sheetLength - 1].ServiceDay.length === 0) {
                        sheet[sheetLength - 1].ServiceDay = { ...Timetables[j].ServiceDay }
                    }

                    if (sheet[sheetLength - 1].Direction[Direction] === undefined) {
                        sheet[sheetLength - 1].Direction[Direction] = Timetables[j].StopTimes[0].StopName.Zh_tw
                    }

                    if (typeof sheet[sheetLength - 1].Time[TimeLocation - 1] !== "object") {
                        sheet[sheetLength - 1].Time[TimeLocation - 1] = []
                    }

                    sheet[sheetLength - 1].Time[TimeLocation - 1][Direction] = Timetables[j].StopTimes[0].DepartureTime
                    setSchedule(sheet)
                }
            }
        }

        fetchData(url, applySchedule)

    }, [city, location.state.road, uid, fetchData])

    const stopDirection = routeDirection === 0 ? location.state.end : location.state.start;

    if (stops.length > 0) {
        stopList = stops.map((stop, idx) => {
            let time = '';
            let ifPass = true;
            let nearby = false;
            let busNumber = []
            const _busNearby = busNearby.filter(bus => bus.StopUID === stop.StopUID)
            if (_busNearby.length > 0) {
                const tmpBusNumb = _busNearby.map(bus => bus.PlateNumb)
                busNumber = tmpBusNumb.map((bus) => {
                    return <div key={bus} className={style.busID}>{bus}</div>
                })
            }

            switch (stop.StopStatus) {
                case 1:
                    time = '尚未發車'
                    break;
                case 2:
                    time = '交管不停靠'
                    break;
                case 3:
                    time = '末班車已過'
                    break;
                case 4:
                    time = '今日未營運'
                    break;
                default:
                    if (stop.EstimateTime) {
                        time = `剩 ${Math.ceil(stop.EstimateTime / 60)} 分鐘`;
                        if (Math.ceil(stop.EstimateTime / 60) < 3) nearby = true
                    } else {
                        time = '進站中'
                        nearby = true
                    }
                    ifPass = false;
                    break;
            }

            return <li
                key={stop.StopUID}
                className={`${style.stopInfo} ${ifPass ? style.passed : ''}  ${nearby ? style.current : ''}`}>
                <div className={style.stopTime}>{time}</div>
                <div className={style.stopName}>{stop.StopName.Zh_tw}</div>
                {busNumber.length > 0 && <div className={style.bus}>{busNumber}</div>}
            </li>
        })
    }

    return <section className={style.frameContainer}>
        <Header className={`lightColor ${style.backgroundColor} ${style.header}`} >
            <section className={`mainColor ${style.topRound}`}>
                <Breadcrumbs className="mbHidden" />
                <section className={`pcHidden lightColor ${style.mbRoadInfoTitle}`}>
                    <button onClick={backPreviousPageHandler}><BackArrow /></button>
                </section>
                <section className={`mainColor ${style.container} ${style.roadHeader}`}>
                    <div className={style.tool}>
                        <button className={`pcHidden ${style.toolIcon}`}>
                            <Location />
                        </button>
                        <button className={style.toolIcon} onClick={openModalHandler}>
                            <Time />
                            <div className={`mbHidden ${style.toolName}`}>
                                公車班表
                            </div>
                        </button>
                    </div>
                    <div className={style.roadTitle}>
                        <h2>{location.state.road}</h2>
                        <h3>
                            {location.state.start}
                            <TwoWayArrow />
                            {location.state.end}
                        </h3>
                    </div>
                </section>
            </section>
        </Header>
        <section className={style.contentBackground}>
            <section className={`lightColor ${style.topRound} ${style.content} `}>
                <section className={style.leftContent}>
                    <div className={`pcHidden`}>
                        <button>
                            <div className={style.triangle}></div>
                        </button>
                    </div>
                    <div className={style.leftSubHeader}>
                        <div className={style.LSHDescription}>
                            <div>行駛方向</div>
                            <div>
                                往
                                <div className={style.directionName}>
                                    {stopDirection}
                                </div>
                            </div>
                        </div>
                        <button className={style.LSIcon} onClick={stopDirectionHandler}>
                            <Exchange />
                        </button>
                    </div>
                    <ul className={style.LSContent}>
                        {!loading&&stopList}
                    </ul>
                </section>
                <section className={style.rightContent}>
                    <div className={style.mapContainer}>
                        {/* <div className={style.mapStopSwitch}>
                            顯示站點
                            <Switch className={style.mapSwitch} />
                        </div> */}
                    </div>
                </section>
            </section>
        </section>
        <Timetables
            isOpen={isOpen}
            road={location.state.road}
            schedule={schedule}
            closeModalHandler={closeModalHandler}
        />
        <Modal isOpen={alertOpen} onClick={alertHandler}>
            <section className={style.alert}>很抱歉，目前僅提供桃園市資料查詢</section>
        </Modal>
        <Footer className={`mbHidden`} />
    </section>
}

export default RoadInfo
