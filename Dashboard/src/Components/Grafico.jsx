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
  const colors = ["#f4b400", "#4285F4", "#34A853", "#EA4335", "#9C27B0"];

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

        {users.map((user, index) => (
          <Bar
            key={user.user_id}
            dataKey={user.user_id}
            stackId="a"
            fill={colors[index % colors.length]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export default UsageChart;
