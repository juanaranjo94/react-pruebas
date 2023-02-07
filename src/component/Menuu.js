import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';


class Menu extends Component{
	render(){
		
        let { lang , children} = this.props;

		return (
            <>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav">
                            <li className="nav-item "><NavLink className="nav-link" to={`${lang}`}>Home</NavLink></li>
                            <li className="nav-item "><NavLink className="nav-link" to={`${lang}/about`}>About</NavLink></li>
                            <li className="nav-item "><NavLink className="nav-link" to={`${lang}/topics`}>Topics</NavLink></li>
                            <li className="nav-item "><NavLink className="nav-link" to={`${lang}/contacts`}>Contacts</NavLink></li>
                        </ul>
                    </div>
                </nav>
                {children}
            
                <footer className="page-footer font-small blue">
                <div className="footer-copyright text-center py-3">© 2020 Copyright:
                    <a href="/"> MDBootstrap.com</a>
                </div>
                </footer>
            </>
		);
	}
}	

export default Menu;