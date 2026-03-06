import Horas from "./Horas"
import "./Corpo.css"
import { useState } from "react"
import { getTimeByUser } from "../services/timeService"

function Corpo() {

    const [uuid, setUuid] = useState("")
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  async function handleLoad() {
    if (!uuid) return

    setLoading(true)

    try {
      const result = await getTimeByUser(uuid)
      setData(result)
    } catch (err) {
      alert("Erro ao buscar dados")
    }

    setLoading(false)
  }
  return (
    <div className="Corpo">
    <div >
        <div>
             <input
        type="text"
        placeholder="Busque o nome do usuário"
        value={uuid}
        onChange={(e) => setUuid(e.target.value)}
        style={{ width: "400px", marginRight: "10px" }}
      />

      <button onClick={handleLoad}>
        Buscar horas
      </button>

      {loading && <p>Carregando...</p>}

      <ul>
        {data.map((item) => (
          <li key={item.id}>
            {item.domain} — {item.seconds} segundos
          </li>
        ))}
      </ul>
        </div>
    </div>
    <Horas></Horas>
    </div>
  )
}  

export default Corpo