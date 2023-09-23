import React, { useState, useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom'

import {CITY_VALUE_TABLE} from "../../util/constant";
import Footer from "../../component/footer/Footer";
import Keyboard from "../../component/keyboard/Keyboard";
import ResultImg from '../../component/resultImg/ResultImg';
import RoadList from "../../component/roadList/RoadList";

import style from "./Bus.module.css";
import { ReactComponent as Search } from "../../img/icon/search.svg";
import useFetch from "../../hook/useFetch";
import Header from "../../component/header/Header";
import Breadcrumbs from "../../component/UI/breadcrumbs/Breadcrumbs";

const Bus = (props) => {
    const [city, setCity] = useState('')
    const [searchingRoad,setSearchingRoad] =useState('')
    const [roadList, setRoadList] = useState([])
    const [browserCity, setBrowserCity] = useState('')
    const [mbListLonger, setMbListLonger] = useState(false)
    const [ loading, fetchData ] = useFetch()
    const location = useLocation();
    const pathName = location.pathname

    const searchCityHandler = (e) => {
        const cityValue = CITY_VALUE_TABLE.reduce((key, cityObj) => {
            if (Object.values(cityObj)[0] === e.target.value) {
                key = Object.keys(cityObj)[0]
            }
            return key
        }, '')
        setCity(cityValue)
    }

    const searchRoadHandler = (e) => {
        setSearchingRoad(e.target.value)
    }

    const sliceRoadEndHandler = () => {
        setSearchingRoad(state => state.slice(0, -1))
    }

    const getBtnValueHandler = (e) => {
        setSearchingRoad(state => state + e.target.value)
    }

    const cleanHandler = () => {
        setSearchingRoad('');
    }

    const getListLonger = () =>{
        setMbListLonger(state => !state)
    }
    
    const onLikeHandler = (RouteUID, routeName, DepartureStopNameZh, DestinationStopNameZh, liked) => {
        if( localStorage.getItem('routeLiked') === null ){
            localStorage.setItem('routeLiked', JSON.stringify([]))
        }
        const routeLiked = JSON.parse(localStorage.getItem('routeLiked'))
        
        if( liked ){
            const routeInfo = {
                RouteUID,
                RouteName:{Zh_tw:routeName},
                DepartureStopNameZh, 
                DestinationStopNameZh,
                liked
            }
            routeLiked.push(routeInfo)
            localStorage.setItem('routeLiked', JSON.stringify(routeLiked))
        }
        
        if( !liked ){
            const newRouteLiked = routeLiked.filter( obj => obj.RouteUID !== RouteUID )
            localStorage.setItem('routeLiked', JSON.stringify(newRouteLiked))
        }
    }

    // 初始位置
    useEffect(() => {
        navigator.geolocation.getCurrentPosition((data) => {
            const { coords } = data
            const url = `https://gist.motc.gov.tw/gist_api/V3/Map/GeoLocating/District/LocationX/${coords.longitude}/LocationY/${coords.latitude}`

            const applyLocation = (locationArray) => {
                const [location] = locationArray
                setBrowserCity(location.City)
            }

            fetchData(url, applyLocation)
        })
    }, [fetchData])

    // 搜尋路線
    useEffect(() => {
        if (!searchingRoad) {
            setRoadList([])
            return
        }

        let url = ''
        
        if(!!city){
            url = `https://ptx.transportdata.tw/MOTC/v2/Bus/Route/City/${city}/${searchingRoad}?$select=RouteUID%2CRouteName%2CDepartureStopNameZh%2C%20DestinationStopNameZh&$top=30`;
        }else if(!!browserCity){
            url = `https://ptx.transportdata.tw/MOTC/v2/Bus/Route/City/${browserCity}/${searchingRoad}?$select=RouteUID%2CRouteName%2CDepartureStopNameZh%2C%20DestinationStopNameZh&$top=30`;
        }else{
            url = `https://ptx.transportdata.tw/MOTC/v2/Bus/Route/City/Taoyuan/${searchingRoad}?$select=RouteUID%2CRouteName%2CDepartureStopNameZh%2C%20DestinationStopNameZh&$top=30`;
        }

        const applyRoad = (data) => {
            if (data.length === 0){
                setRoadList([])
            }

            setRoadList(roadList=> {
                const sameRoad = roadList.filter(road => {
                    return data.some(route => route.RouteUID === road.RouteUID) 
                })
    
                const newRoad = data.filter(route => {
                    return roadList.every(road => road.RouteUID !== route.RouteUID)
                })
                return [...sameRoad, ...newRoad]
            })
        }

        fetchData(url, applyRoad)


        return function resetRoadList() {
            setRoadList([])
        }

    }, [searchingRoad, city, browserCity, fetchData])

    return <section className={style.frameContainer}>
        <Header className={`mainColor`} pathName={pathName} >
            <section className={`mainColor ${style.bottomRound}`}>
                <Breadcrumbs />
                <form className={`${style.container} ${style.searchBar}`}>
                    <span>*選擇縣市有助於您更快找到路線</span>
                    <div className={style.searching}>
                        <input list="city" placeholder="請選擇縣市或手動輸入關鍵字" onChange={searchCityHandler} />
                        <datalist id="city" >
                            {CITY_VALUE_TABLE.map((cityObj, idx) => <option key={idx} data-value={Object.keys(cityObj)[0]} value={Object.values(cityObj)[0]}></option>)}
                        </datalist>
                        <div className={style.road}>
                            <input type="text" placeholder="請選擇路線或手動輸入關鍵字" value={searchingRoad} onChange={searchRoadHandler} />
                            <button type="submit"><Search /></button>
                        </div>
                    </div>
                </form>
            </section>   
        </Header>
        <section className={`${style.container} ${style.content}`}>
            <div className={style.result}>
                <div className={`mainColor mbHidden ${style.caption} `}>搜尋結果</div>
                <div className={`${style.searchResult}`}>
                    {!searchingRoad && < ResultImg state={true} text={'尋找您的公車路線'}/>}
                    {searchingRoad && roadList.length > 0 && 
                    <RoadList 
                        roadList={roadList}
                        getLonger={mbListLonger}
                        link="bus"
                        listType="route"
                        onLikeClick={onLikeHandler}
                    />}
                    {searchingRoad && !loading && roadList.length === 0 && <ResultImg text={'很抱歉，找不到符合的路線'}/>}
                </div>
            </div>
            <Keyboard
                onClick={getBtnValueHandler}
                getSmaller={getListLonger}
                sliceEnd={sliceRoadEndHandler}
                cleanValue={cleanHandler} />
        </section>
        <Footer className={`mbHidden`} />
    </section>
}

export default Bus;