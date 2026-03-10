import "./Header.css"
import nexilogo from "../assets/nexilogo.svg"

function Header({ user }) {
    console.log(user)

    return (
        <header className="header">
            <div className="logo">
                <img src={nexilogo} alt="" />
                <h2>Nex'oClock</h2>
                <h3>Nexi's Clockify</h3>
            </div>
            <div className="conta">
                <p>{user}</p>
                <div className="user-avatar" style={{ backgroundColor: "var(--verde)" }}>
                </div>
            </div>
        </header>
    )
}

export default Header
