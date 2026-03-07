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
          tickFormatter={(day) =>
            new Date(day).toLocaleDateString("pt-BR", {
              weekday: "short",
              day: "2-digit",
            })
          }
        />

        <YAxis />

        <Tooltip formatter={(value) => `${value} horas`} />

        {users.map((user) => (
          <Bar
            key={user.name}
            dataKey={user.name}
            stackId="a"
            fill={user.color}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export default UsageChart;
