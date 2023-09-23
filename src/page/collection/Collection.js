import React, { useState, useEffect } from 'react'

import Header from '../../component/header/Header'
import Breadcrumbs from '../../component/UI/breadcrumbs/Breadcrumbs'
import RoadList from '../../component/roadList/RoadList'
import Footer from '../../component/footer/Footer'
import Search from '../../img/search.png'
import {ReactComponent as Previous} from '../../img/icon/previous.svg'

import style from './Collection.module.css'

const Collection = (props) => {
    const [tab, setTab] = useState('route')
    const [roadList, setRoadList] = useState([])
    const [listPage, setListPage] = useState(1);
    let nextPageClass = `${style.pageNext}`;
    let previousPageClass = `${style.pagePrevious}`;

    const onLikeHandler = (RouteUID, routeName, DepartureStopNameZh, DestinationStopNameZh, liked) => {
        const routeLiked = JSON.parse(localStorage.getItem('routeLiked'))
        
        if(tab === 'route' ){
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
        }
        
        if( !liked ){
            const newRouteLiked = routeLiked.filter( obj => obj.RouteUID !== RouteUID )
            localStorage.setItem('routeLiked', JSON.stringify(newRouteLiked))
        }
    }

    const nextPageHandler = () => {
        if( (roadList.length / 10 ) > listPage ){
            setListPage(page => page + 1)
        }
    }

    const previousPageHandler = () => {
        if( listPage > 1 ){
            setListPage(page => page - 1)
        }
    }

    const tabHandler = (e) => {
        if (e.target.value === tab) {
            return
        }
        if (e.target.value === 'route') {
            setTab('route')
        } else {
            setTab('stop')
        }
    }

    useEffect(()=>{
        setRoadList(JSON.parse(localStorage.getItem(`${tab}Liked`)))
    },[tab])

    const ifRouteTabActive = tab === 'route' ? `${style.active}` : '';
    const ifStopTabActive = tab === 'stop' ? `${style.active}` : '';
    const ifLikedExist = roadList.length > 0 ? `${style.likedExist}` : '';
    const viewRoadList = roadList.slice( (listPage*10-10), listPage*10)

    if( (roadList.length / 10 ) > listPage ){
        nextPageClass = `${nextPageClass} ${style.clickable}`
    }else{
        nextPageClass = `${style.pageNext}`
    }

    if( listPage > 1 ){
        previousPageClass = `${previousPageClass} ${style.clickable}`
    }else{
        previousPageClass = `${style.pagePrevious}`;
    }

    return (
        <section className={style.frameContainer}>
            <Header className={`mainColor`}>
                <section className={`mainColor ${style.bottomRound}`}>
                    <Breadcrumbs />
                    <h2 className={`${style.title}`}>我的收藏</h2>
                </section>
            </Header>
            <section className={`${style.container}`}>
                <section className={`${style.contentContainer} `}>
                    <aside className={`${style.contentNav}`}>
                        <button className={`${ifRouteTabActive}`} value={'route'} onClick={tabHandler}>路線</button>
                        <button className={`${ifStopTabActive}`} value={'stop'} onClick={tabHandler}>站點</button>
                    </aside>
                    <section className={`${style.content} ${ifLikedExist}`}>
                        {roadList.length === 0 && <div className={style.contentImg}><img src={Search} alt="尚未新增路線至我的收藏" /><p>尚未新增內容至我的收藏</p></div>}
                        {roadList.length >0 && <RoadList
                            roadList={viewRoadList}
                            onLikeClick={onLikeHandler}
                            link={'bus'}
                            listType={tab}
                        />}
                        {roadList.length > 10 && <div className={`${style.pageController}`}>
                            <button className={previousPageClass} onClick={previousPageHandler}><Previous /></button>
                            <button className={nextPageClass} onClick={nextPageHandler}><Previous /></button>
                        </div>}
                    </section>
                </section>
            </section>
            <Footer />
        </section>
    )
}

export default Collection