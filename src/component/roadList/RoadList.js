import React from 'react'

import RouteListItem from './RouteListItem';

import style from './RoadList.module.css';

const cityTable = {
    "TPE": "臺北市",
    "NWT": "新北市",
    "TAO": "桃園市",
    "TXG": "臺中市",
    "TNN": "臺南市",
    "KHH": "高雄市",
    "KEE": "基隆市",
    "HSZ": "新竹市",
    "HSQ": "新竹縣",
    "MIA": "苗栗縣",
    "CHA": "彰化縣",
    "NAN": "南投縣",
    "YUN": "雲林縣",
    "CYQ": "嘉義縣",
    "CYI": "嘉義市",
    "PIF": "屏東縣",
    "ILA": "宜蘭縣",
    "HUA": "花蓮縣",
    "TTT": "臺東縣",
    "KIN": "金門縣",
    "PEN": "澎湖縣",
    "LIE": "連江縣"
}

const NickNameTransCity = {
    "TPE": "Taipei",
    "NWT": "NewTaipei",
    "TAO": "Taoyuan",
    "TXG": "Taichung",
    "TNN": "Tainan",
    "KHH": "Kaohsiung",
    "KEE": "Keelung",
    "HSZ": "Hsinchu",
    "HSQ": "HsinchuCounty",
    "MIA": "MiaoliCounty",
    "CHA": "ChanghuaCounty",
    "NAN": "NantouCounty",
    "YUN": "YunlinCounty",
    "CYQ": "ChiayiCounty",
    "CYI": "Chiayi",
    "PIF": "PingtungCounty",
    "ILA": "YilanCounty",
    "HUA": "HualienCounty",
    "TTT": "TaitungCounty",
    "KIN": "KinmenCounty",
    "PEN": "PenghuCounty",
    "LIE": "LienchiangCounty"
}

const RoadList = (props) => {

    const {
        roadList,
        onLikeClick,
        link,
        listType,
        getLonger
    } = props;
    
    const longer = getLonger ? style.longer : '';

    let List;

    if (listType === 'stop') {
        List = roadList.map((data) => {
            const cityCode = data.RouteUID.slice(0, 3);
            const cityFetchValue = NickNameTransCity[cityCode];
            const linkParams = `/${link}/${cityFetchValue}/${data.RouteUID}`;

            return <RouteListItem
                key={data.RouteUID}
                UITitle={data.StopName}
                UIFrom={data.RouteName.Zh_tw}
                UITo={data.DestinationStopNameZh}
                UIdefaultLiked={true}
                UINote={data.UINote} 
                link={linkParams}
                onLikeClick={onLikeClick}
                listType={'stop'}
                routeName={data.RouteName.Zh_tw}
                routeUID={data.RouteUID}
                city={cityFetchValue}
                start={data.DepartureStopNameZh}
                end={data.DestinationStopNameZh}
            ></RouteListItem>
        })
    }
    if (listType === 'route') {
        List = roadList.map((data) => {
            const cityCode = data.RouteUID.slice(0, 3);
            const cityName = cityTable[cityCode];
            const cityFetchValue = NickNameTransCity[cityCode];
            const linkParams = `/${link}/${cityFetchValue}/${data.RouteUID}`;
            const originLiked = data.hasOwnProperty('liked') ? data.liked:false;

            return <RouteListItem
                key={data.RouteUID}
                UITitle={data.RouteName.Zh_tw}
                UIFrom={data.DepartureStopNameZh}
                UITo={data.DestinationStopNameZh}
                UIdefaultLiked={originLiked}
                UINote={cityName} 
                link={linkParams}
                onLikeClick={onLikeClick}
                listType={'route'}
                routeName={data.RouteName.Zh_tw}
                routeUID={data.RouteUID}
                city={cityFetchValue}
                start={data.DepartureStopNameZh}
                end={data.DestinationStopNameZh}
            ></RouteListItem>
        })
    }

    return (
        <div className={`${style.scrollBar} ${longer}`}>
            <ul className={`${style.list}`}>
                {List}
            </ul>
        </div>
    )
}
export default RoadList;
