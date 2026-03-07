import { useEffect, useState } from "react";
import { getGroupedUsage } from "../services/timeService";
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

  useEffect(() => {
    loadData();
  }, []);

async function loadData() {
  const result = await getGroupedUsage();

  console.log("RESULTADO RPC:", result); // 👈 adicionar

  setUsers(result);

  const max = Math.max(
    ...result.map((user) => getTotalSeconds(user.domains)),
  );

  setMaxSeconds(max);
}

  return (
    <div className="app-container">
      <UsageChart data={chartData} users={users} />

      <div className="user-table">
        {users.map((user) => (
          <UserRow
            key={user.name}
            user={user}
            cor={user.color}
            maxSeconds={maxSeconds}
            onClick={setSelectedUser}
          />
        ))}
      </div>
      <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
}

export default Corpo;
