import React from "react";
import'./admNav.css';
import { Link } from "react-router-dom";

const Nav = () => {
    return(
        <div className="adm-mydex-header">
            <Link to="/adm/admmainpage">MYDEX</Link>
        </div>
    )
}

export default Nav;