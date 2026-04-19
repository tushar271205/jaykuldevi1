import { useState, useEffect } from 'react';
import { getRevenueReport } from '../../api/admin';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { IconDollar, IconPackage, IconBarChart, IconTrophy } from '../../components/common/Icons';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function AdminRevenue() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getRevenueReport(year)
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [year]);

  const monthly = data?.monthlyRevenue || [];
  const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
    const found = monthly.find((m) => m._id?.month === i + 1);
    return found?.revenue || 0;
  });
  const monthlyOrders = Array.from({ length: 12 }, (_, i) => {
    const found = monthly.find((m) => m._id?.month === i + 1);
    return found?.orders || 0;
  });

  const totalRevenue = monthlyRevenue.reduce((s, v) => s + v, 0);
  const totalOrders = monthlyOrders.reduce((s, v) => s + v, 0);

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => `₹${ctx.raw.toLocaleString('en-IN')}` } } },
    scales: { y: { ticks: { callback: (v) => `₹${(v / 1000).toFixed(0)}k` } }, x: { grid: { display: false } } },
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-header-flex" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Revenue Report</h1>
        <select
          className="form-select"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          style={{ maxWidth: 120, height: 40 }}
        >
          {[2026, 2027, 2028, 2029].map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="admin-stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {loading ? (
          [1,2,3,4].map((i) => <div key={i} className="skeleton" style={{ height: 90, borderRadius: 16 }} />)
        ) : [
          { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, color: '#10b981', icon: <IconDollar size={18} /> },
          { label: 'Total Orders', value: totalOrders.toLocaleString(), color: '#3b82f6', icon: <IconPackage size={18} /> },
          { label: 'Avg Order Value', value: totalOrders ? `₹${Math.round(totalRevenue / totalOrders).toLocaleString('en-IN')}` : '₹0', color: '#8b5cf6', icon: <IconBarChart size={18} /> },
          { label: 'Best Month', value: MONTHS[monthlyRevenue.indexOf(Math.max(...monthlyRevenue))] || '—', color: '#f59e0b', icon: <IconTrophy size={18} /> },
        ].map((card) => (
          <div key={card.label} className="admin-stat-card" style={{ background: 'white', borderRadius: 16, padding: '20px 20px', border: '1px solid var(--gray-100)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: 8 }}>{card.icon} {card.label}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--gray-900)', fontFamily: 'var(--font-display)' }}>{card.value}</div>
          </div>
        ))}
      </div>


      {/* Revenue Chart */}
      <div style={{ background: 'white', borderRadius: 16, padding: '24px', border: '1px solid var(--gray-100)', marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Monthly Revenue — {year}</h2>
        {loading ? (
          <div className="skeleton" style={{ height: 240 }} />
        ) : (
          <Bar
            data={{
              labels: MONTHS,
              datasets: [{
                data: monthlyRevenue,
                backgroundColor: 'rgba(27, 73, 101, 0.7)',
                borderRadius: 6,
                borderSkipped: false,
              }],
            }}
            options={chartOptions}
            height={70}
          />
        )}
      </div>

      {/* Orders Chart */}
      <div style={{ background: 'white', borderRadius: 16, padding: '24px', border: '1px solid var(--gray-100)', marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Monthly Orders — {year}</h2>
        {loading ? (
          <div className="skeleton" style={{ height: 240 }} />
        ) : (
          <Line
            data={{
              labels: MONTHS,
              datasets: [{
                data: monthlyOrders,
                borderColor: '#5fa8d3',
                backgroundColor: 'rgba(95, 168, 211, 0.1)',
                borderWidth: 2,
                pointRadius: 4,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#5fa8d3',
              }],
            }}
            options={{
              ...chartOptions,
              scales: { ...chartOptions.scales, y: { ticks: { callback: (v) => v.toLocaleString() } } },
              plugins: { ...chartOptions.plugins, tooltip: { callbacks: { label: (ctx) => `${ctx.raw} orders` } } },
            }}
            height={70}
          />
        )}
      </div>

      {/* Monthly Table */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--gray-100)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--gray-100)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Month-by-Month Breakdown</h2>
        </div>
        <div className="table-wrap" style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Orders</th>
                <th>Revenue</th>
                <th>Avg Order Value</th>
                <th>Share of Annual Revenue</th>
              </tr>
            </thead>
            <tbody>
              {MONTHS.map((month, i) => (
                <tr key={month}>
                  <td style={{ fontWeight: 600 }}>{month} {year}</td>
                  <td>{monthlyOrders[i]}</td>
                  <td style={{ fontWeight: 700 }}>₹{monthlyRevenue[i].toLocaleString('en-IN')}</td>
                  <td>{monthlyOrders[i] ? `₹${Math.round(monthlyRevenue[i] / monthlyOrders[i]).toLocaleString('en-IN')}` : '—'}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 6, background: 'var(--gray-100)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: 'var(--primary)', borderRadius: 3, width: totalRevenue ? `${(monthlyRevenue[i] / totalRevenue) * 100}%` : '0%' }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-500)', minWidth: 36 }}>
                        {totalRevenue ? `${((monthlyRevenue[i] / totalRevenue) * 100).toFixed(1)}%` : '0%'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
