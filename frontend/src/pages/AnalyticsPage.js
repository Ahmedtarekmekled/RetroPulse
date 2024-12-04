import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import api from '../utils/axios';
import DynamicText from '../components/DynamicText';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function AnalyticsPage() {
  const [overview, setOverview] = useState(null);
  const [visits, setVisits] = useState([]);
  const [dateRange, setDateRange] = useState('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [overviewRes, visitsRes] = await Promise.all([
        api.get('/api/analytics/overview'),
        api.get(`/api/analytics/visits?groupBy=${dateRange}`)
      ]);

      setOverview(overviewRes.data);
      setVisits(visitsRes.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: visits.map(v => v._id),
    datasets: [{
      label: 'Visits',
      data: visits.map(v => v.count),
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      fill: true,
      tension: 0.1
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#22c55e'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(34, 197, 94, 0.1)'
        },
        ticks: {
          color: '#22c55e'
        }
      },
      x: {
        grid: {
          color: 'rgba(34, 197, 94, 0.1)'
        },
        ticks: {
          color: '#22c55e'
        }
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-green-500">
        <DynamicText text="Analytics Dashboard" typewriter={true} />
      </h1>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-green-500 animate-pulse">Loading analytics...</p>
        </div>
      ) : (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="border border-green-500 p-4">
              <h3 className="text-sm text-green-400">Total Visits</h3>
              <p className="text-2xl font-bold">{overview?.overview.total}</p>
            </div>
            <div className="border border-green-500 p-4">
              <h3 className="text-sm text-green-400">Today's Visits</h3>
              <p className="text-2xl font-bold">{overview?.overview.today}</p>
            </div>
            <div className="border border-green-500 p-4">
              <h3 className="text-sm text-green-400">Bounce Rate</h3>
              <p className="text-2xl font-bold">
                {Math.round(overview?.overview.bounceRate * 100)}%
              </p>
            </div>
            <div className="border border-green-500 p-4">
              <h3 className="text-sm text-green-400">Avg. Duration</h3>
              <p className="text-2xl font-bold">
                {Math.round(overview?.overview.avgDuration / 60)} min
              </p>
            </div>
          </div>

          {/* Visits Chart */}
          <div className="border border-green-500 p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Visits Over Time</h3>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-black border border-green-500 text-green-500 px-3 py-1"
              >
                <option value="hour">Hourly</option>
                <option value="day">Daily</option>
                <option value="week">Weekly</option>
                <option value="month">Monthly</option>
              </select>
            </div>
            <div className="h-[400px]">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Top Pages */}
          <div className="border border-green-500 p-4">
            <h3 className="text-lg font-semibold mb-4">Top Pages</h3>
            <div className="space-y-2">
              {overview?.topPages.map(page => (
                <div key={page._id} className="flex justify-between items-center">
                  <span className="text-green-400">{page._id}</span>
                  <span>{page.count} visits</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AnalyticsPage; 