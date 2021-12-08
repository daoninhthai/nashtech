import React, {useState} from "react";
import Header from "../../layout/header/Header";
import Footer from "../../layout/footer/Footer";
import Navbar from "../../layout/Navbar/Navbar";

const Mainpage = () => {
    const [currentPage, setCurrentPage] = useState("Home");
    const [childPage, setChildPage] = useState(null);
    return (

        <>
            <Header currentPage={currentPage} childPage={childPage}/>
            <Navbar setCurrentPage={setCurrentPage} setChildPage={setChildPage}/>
            <Footer/>
        </>


    );
};

export default Mainpage;
