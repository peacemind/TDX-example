import React from 'react';
import { Link } from 'react-router-dom';

import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';

import style from './Home.module.css';
import { ReactComponent as BusIcon } from '../../img/icon/bus.svg';
import { ReactComponent as NearbyIcon } from '../../img/icon/location.svg';
import { ReactComponent as TimeIcon } from '../../img/icon/time.svg';
import { ReactComponent as CollectionIcon } from '../../img/icon/collection.svg';


const Home = (props) => {
  return <section className={`${style.frameContainer}`}>
    <section className={style.banner}>
      <Header className={`mbHidden whiteFont`} />
      <section className={style.bannerText}>
        <div>Hello,Bus!</div>
        <div>全台公車動態時刻查詢網</div>
      </section>
    </section>
    <section className={style.iconNav}>
      <Link to="/bus">
        <BusIcon />
        公車動態
      </Link>
      <Link to="/nearby">
        <NearbyIcon />
        附近站點</Link>
      <Link to="/schedule">
        <TimeIcon />
        班表查詢</Link>
      <Link to="/collection">
        <CollectionIcon />
        我的收藏</Link>
    </section>
    <Footer />
  </section>
}

export default Home;