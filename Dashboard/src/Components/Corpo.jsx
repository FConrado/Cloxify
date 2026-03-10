import { useEffect, useState } from "react";
import { getGroupedUsage, getUserDomainsInPeriod, getUser } from "../services/timeService";
import UserRow from "./UserRow";
import UserModal from "./UserModal";
import UsageChart from "./Grafico";
import { buildChartData } from "../services/chartData";
import "./Corpo.css";

function getTotalSeconds(domains) {
  return domains.reduce((acc, d) => acc + d.seconds, 0);
}

function Corpo() {
  const [users, setUsers] = useState([]);
  const [maxSeconds, setMaxSeconds] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const chartData = buildChartData(users);

  const [startDate, setStartDate] = useState( new Date(Date.now() - 7 * 86400000).toLocaleDateString("en-CA"));
  const [endDate, setEndDate] = useState(new Date().toLocaleDateString("en-CA"));

 useEffect(() => {
  

  if (!startDate || !endDate) return

  loadData()


}, [startDate, endDate])

  async function loadData() {

    if (!startDate || !endDate) return

    const result = await getGroupedUsage(startDate, endDate)
    setUsers(result);
    const max = Math.max(
      ...result.map((user) => getTotalSeconds(user.domains)),
    );

    setMaxSeconds(max);
  }

  async function openUserModal(user) {

    const domains = await getUserDomainsInPeriod(user.user_id, startDate, endDate)

    setSelectedUser({
      ...user,
      domains
    })
  }

  return (
    <div className="app-container">
      <UsageChart data={chartData} users={users} />
      <div className="Linhas">
        <div className="dataPicker">
          <p>De: </p>
          <input type="date"
            value={startDate || ""}
            onChange={(e) => setStartDate(e.target.value)} />
          <p>Até: </p>
          <input type="date"
            value={endDate || ""}
            onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div className="user-table">
          {users.map((user) => (
            <UserRow
              key={user.name}
              user={user}
              cor={user.color}
              maxSeconds={maxSeconds}
              onClick={openUserModal}
            />
          ))}
        </div>
      </div>
      <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
}

export default Corpo;
