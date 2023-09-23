import React from 'react';

import style from './Footer.module.css';

const Footer = ({ className }) => {
    className = !!className ? className : '';

    return <footer className={`mainColor ${className} ${style.footer}`}>
        <span>HelloBus ©</span> 2021 Designer Vum. Engineer Althea. All rights reserved.
    </footer>
}

export default Footer;