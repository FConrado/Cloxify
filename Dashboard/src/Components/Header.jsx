import "./Header.css"
import nexilogo from "../assets/nexilogo.svg"

function Header() {
    return (
        <header className="header">
            <div className="logo">
                <img src={nexilogo} alt="" />
                <h2>Nex'oClock</h2>
                <h3>Nexi's Clockify</h3>
            </div>
            <div className="conta">
                <p>Felipe Conrado</p>
                <div className="user-avatar">
                </div>
            </div>
        </header>
    )
}

export default Header
