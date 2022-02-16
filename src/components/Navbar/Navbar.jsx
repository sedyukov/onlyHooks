import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext';
import './Navbar.scss'

const Navbar = () => {
    const { logout, isLogin } = useContext(AuthContext)
    return (
        <nav>
            <div className="nav-wrapper navbar black">
            <a href="/" className="brand-logo">Todos</a>
            {
                isLogin
                ?   <ul id="nav-mobile" className="right hide-on-med-and-down">
                        <li><a href="/" onClick={logout}>Выйти</a></li>
                    </ul>
                :   <ul id="nav-mobile" className="right hide-on-med-and-down">
                        <li><a href="/">Войти</a></li>
                    </ul>
            }
            </div>
        </nav>
    );
}

export default Navbar;
