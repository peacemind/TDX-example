import React, { useState } from "react"
import { Link } from 'react-router-dom'

import { ReactComponent as OneWayArrow } from '../../img/icon/oneWayArrow.svg'
import { ReactComponent as TwoWayArrow } from '../../img/icon/twoWayArrow.svg'
import Liked from '../../img/icon/liked.png'
import Heart from '../../img/icon/heart.png'

import style from './RouteListItem.module.css'

function RouteListItem(props) {
  const {
    UITitle,
    UIFrom,
    UITo,
    UIdefaultLiked = false,
    UINote,
    link,
    onLikeClick,
    listType,
    routeName,
    routeUID,
    city,
    start,
    end
  } = props
  const [liked, setLike] = useState(UIdefaultLiked);
  let likeHandler;
  if (listType === 'stop') {
    likeHandler = () => {
      setLike(state => {
        const newState = !state
        onLikeClick(
          routeUID,
          routeName,
          UITitle,
          UITo,
          city,
          newState
        );
        return newState
      })

    }
  }

  if (listType === 'route') {
    likeHandler = () => {
      setLike(state => {
        const newState = !state
        onLikeClick(
          routeUID,
          routeName,
          start,
          end,
          newState
        );
        return newState
      })
      
    }
  }

  const directionIcon = listType === 'route' ? <TwoWayArrow /> : <OneWayArrow />
  const buttonIcon = liked ? (<img src={Liked} alt="已加為我的收藏" />) : (<img src={Heart} alt="加入我的收藏" />)

  return (
    <li>
      <Link
        to={{
          pathname: link,
          state: {
            road: routeName,
            start,
            end,
            city
          },
        }}
        className={`${style.leftSide}`}
      >
        <button >
          <h1>{UITitle}</h1>
          <span>
            {UIFrom}
            {directionIcon}
            {UITo}
          </span>
        </button>
      </Link>
      <div className={`${style.rightSide}`}>
        <button onClick={likeHandler}>
          {buttonIcon}
        </button>
        {UINote}
      </div>
    </li>
  );
}

export default RouteListItem;
