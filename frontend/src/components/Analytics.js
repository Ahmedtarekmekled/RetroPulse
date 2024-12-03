import { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import api from '../utils/axios';
import DynamicText from './DynamicText';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('week');
  const [groupBy, setGroupBy] = useState('day');
  const [customRange, setCustomRange] = useState({
    start: '',
    end: ''
  });
  
  const chartRef = useRef(null);

  useEffect(() => {
    fetchStats();
    // Cleanup function to destroy chart instance
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [dateRange, groupBy]);

  const fetchStats = async () => {
    try {
      const params = new URLSearchParams({
        groupBy,
        ...(dateRange === 'custom' && {
          startDate: customRange.start,
          endDate: customRange.end
        })
      });

      const response = await api.get(`/api/analytics/stats?${params}`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
    },
    plugins: {
      legend: {
        labels: {
          color: '#22c55e'
        }
      }
    }
  };

  const chartData = stats ? {
    labels: stats.stats.map(stat => stat._id),
    datasets: [{
      label: 'Visits',
      data: stats.stats.map(stat => stat.count),
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.1
    }]
  } : null;

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-green-500 animate-pulse">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-green-500">
          <DynamicText text="Visit Analytics" typewriter={true} />
        </h2>
        <div className="flex space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-black border border-green-500 text-green-500 px-3 py-1"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
      </div>

      {dateRange === 'custom' && (
        <div className="flex space-x-4">
          <input
            type="date"
            value={customRange.start}
            onChange={(e) => setCustomRange(prev => ({ ...prev, start: e.target.value }))}
            className="bg-black border border-green-500 text-green-500 px-3 py-1"
          />
          <input
            type="date"
            value={customRange.end}
            onChange={(e) => setCustomRange(prev => ({ ...prev, end: e.target.value }))}
            className="bg-black border border-green-500 text-green-500 px-3 py-1"
          />
        </div>
      )}

      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-green-500 p-4">
              <h3 className="text-sm text-green-400 mb-2">Total Visits</h3>
              <p className="text-2xl font-bold text-green-500">
                {stats.summary.total}
              </p>
            </div>
            <div className="border border-green-500 p-4">
              <h3 className="text-sm text-green-400 mb-2">Avg. Duration</h3>
              <p className="text-2xl font-bold text-green-500">
                {Math.round(stats.summary.avgDuration / 1000)}s
              </p>
            </div>
            <div className="border border-green-500 p-4">
              <h3 className="text-sm text-green-400 mb-2">Bounce Rate</h3>
              <p className="text-2xl font-bold text-green-500">
                {Math.round(stats.summary.bounceRate * 100)}%
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2 border border-green-500 p-4" style={{ height: '400px' }}>
              {chartData && <Line ref={chartRef} data={chartData} options={chartOptions} />}
            </div>
            <div className="border border-green-500 p-4">
              <h3 className="text-lg font-semibold mb-4 text-green-500">Top Pages</h3>
              <div className="space-y-2">
                {stats.topPages.map(page => (
                  <div key={page._id} className="flex justify-between text-green-400">
                    <span className="truncate">{page._id}</span>
                    <span>{page.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Analytics; 