import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function UsageChart({ data, users }) {
  
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
  dataKey="day"
  tickFormatter={(day) => {
    const [year, month, date] = day.split("-")
    const d = new Date(year, month - 1, date)

    return d.toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "2-digit",
    })
  }}
/>

        <YAxis />

        <Tooltip formatter={(value) => `${value} horas`} cursor={{fill: '#09bc890a'}}/>

        {users.map((user) => (
          <Bar
            key={user.name}
            dataKey={user.user_id}
            stackId="a"
            fill={user.color}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export default UsageChart;
