
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

interface ReportsChartsProps {
  data: any;
  type: 'appointments' | 'accounts' | 'users';
}

const ReportsCharts = ({ data, type }: ReportsChartsProps) => {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const renderAppointmentsChart = () => {
    const chartData = [
      { name: 'Confirmados', value: data.confirmed },
      { name: 'Pendentes', value: data.pending },
      { name: 'Cancelados', value: data.cancelled }
    ];

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e293b', 
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderAccountsChart = () => {
    const chartData = [
      { name: 'Jan', recebido: 2800, aReceber: 1200 },
      { name: 'Fev', recebido: 3200, aReceber: 1800 },
      { name: 'Mar', recebido: 2900, aReceber: 2200 },
      { name: 'Abr', recebido: 3500, aReceber: 1900 },
      { name: 'Mai', recebido: 3200, aReceber: 2800 }
    ];

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e293b', 
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Bar dataKey="recebido" fill="#10B981" name="Recebido" />
          <Bar dataKey="aReceber" fill="#F59E0B" name="A Receber" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderUsersChart = () => {
    const chartData = [
      { name: 'Jan', novos: 8, ativos: 45 },
      { name: 'Fev', novos: 12, ativos: 52 },
      { name: 'Mar', novos: 15, ativos: 61 },
      { name: 'Abr', novos: 18, ativos: 73 },
      { name: 'Mai', novos: 12, ativos: 89 }
    ];

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e293b', 
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Line type="monotone" dataKey="novos" stroke="#3B82F6" name="Novos Clientes" strokeWidth={3} />
          <Line type="monotone" dataKey="ativos" stroke="#10B981" name="Clientes Ativos" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  switch (type) {
    case 'appointments':
      return renderAppointmentsChart();
    case 'accounts':
      return renderAccountsChart();
    case 'users':
      return renderUsersChart();
    default:
      return <div className="text-slate-400">Gráfico não disponível</div>;
  }
};

export default ReportsCharts;
