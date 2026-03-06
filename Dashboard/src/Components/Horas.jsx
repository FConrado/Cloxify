import "./Horas.css"
function Horas({user, tempo}){

    return(
        <div className="Horas">
            <div className="Graph">
                <p>{user}</p>
                <p>{tempo} horas</p>
            </div>
        </div>
    )
}

export default Horas
