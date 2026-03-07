import "./Header.css"
import nexilogo from "../assets/nexilogo.svg"

function Header(){
    return(
        <header className="header">
            <div className="logo">
                <img src={nexilogo} alt="" />
                <h2>Cloxify</h2>
            </div>
            <h3>Nexi's Clockify - A GragasDEV Product</h3>
        </header>
    )
}

export default Header
