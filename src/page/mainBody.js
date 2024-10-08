import React ,{ useState } from "react";
import Card from "../components/Card";
import data from "../file/data";
// import Slide from"../components/Slide";
import './mainBody.css';

function MainBody(){
    const [shoes, setShoes] = useState(data);
    return(
        <div className="main-body-container">

        {/* {
            shoes.map((a,i)=>{
                return(
                    <Card shoes={shoes[i]} i={i}/>
                )
            })
        } */}
        <Card/>
        <>
        {/* <Slide/> */}
        </>
        </div>

    )
};

export default MainBody;