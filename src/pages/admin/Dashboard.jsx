import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  FaUsers, FaClipboardList, FaBell, FaShieldAlt, 
  FaArrowRight, FaBuilding, FaMoneyBillWave,
  FaCheckCircle, FaClock, FaExclamationTriangle,
  FaUserCheck, FaUserClock, FaFileInvoice, FaChartLine,
  FaCalendarAlt, FaDollarSign, FaPercent
} from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalResidents: 0,
    activeResidents: 0,
    totalGuards: 0,
    activeGuards: 0,
    totalBills: 0,
    totalAmount: 0,
    collectedAmount: 0,
    pendingAmount: 0,
    overdueAmount: 0,
    totalComplaints: 0,
    pendingComplaints: 0,
    inProgressComplaints: 0,
    resolvedComplaints: 0,
    visitorsToday: 0,
    totalNotices: 0,
    publishedNotices: 0,
    totalBookings: 0
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [complaintCategories, setComplaintCategories] = useState([]);
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setStats(response.data.data.stats);
        setMonthlyData(response.data.data.monthlyData);
        setRecentActivities(response.data.data.recentActivities);
        setComplaintCategories(response.data.data.complaintCategories || [
          { category: 'Plumbing', count: 3 },
          { category: 'Electrical', count: 2 },
          { category: 'Security', count: 1 },
          { category: 'AC Repair', count: 2 },
          { category: 'Other', count: 1 }
        ]);
      }
    } catch (error) {
      console.error('Dashboard error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const lineChartData = {
    labels: monthlyData.map(d => d.month),
    datasets: [
      {
        label: 'Collected',
        data: monthlyData.map(d => d.collected),
        borderColor: '#ff8906',
        backgroundColor: 'rgba(255, 137, 6, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#ff8906',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'Expenses',
        data: monthlyData.map(d => d.expenses),
        borderColor: '#6c63ff',
        backgroundColor: 'rgba(108, 99, 255, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#6c63ff',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#94a1b2',
          font: { size: 12, family: 'Inter' },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 14, 23, 0.95)',
        titleColor: '#fffffe',
        bodyColor: '#94a1b2',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            let value = context.parsed.y;
            return label + ': PKR ' + value.toLocaleString();
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#94a1b2', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { 
          color: '#94a1b2', 
          font: { size: 11 },
          callback: function(value) {
            return 'PKR ' + value.toLocaleString();
          }
        },
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  const barChartData = {
    labels: monthlyData.map(d => d.month),
    datasets: [
      {
        label: 'Collected',
        data: monthlyData.map(d => d.collected),
        backgroundColor: 'rgba(255, 137, 6, 0.7)',
        borderColor: '#ff8906',
        borderWidth: 2,
        borderRadius: 6,
        hoverBackgroundColor: 'rgba(255, 137, 6, 0.9)',
      },
      {
        label: 'Pending',
        data: monthlyData.map(d => d.collected * 0.2),
        backgroundColor: 'rgba(255, 193, 7, 0.7)',
        borderColor: '#ffc107',
        borderWidth: 2,
        borderRadius: 6,
        hoverBackgroundColor: 'rgba(255, 193, 7, 0.9)',
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#94a1b2',
          font: { size: 12, family: 'Inter' },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 14, 23, 0.95)',
        titleColor: '#fffffe',
        bodyColor: '#94a1b2',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            let value = context.parsed.y;
            return label + ': PKR ' + value.toLocaleString();
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#94a1b2', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { 
          color: '#94a1b2', 
          font: { size: 11 },
          callback: function(value) {
            return 'PKR ' + value.toLocaleString();
          }
        },
      }
    },
  };

  const doughnutData = {
    labels: ['Pending', 'In Progress', 'Resolved'],
    datasets: [
      {
        data: [
          stats.pendingComplaints || 0,
          stats.inProgressComplaints || 0,
          stats.resolvedComplaints || 0
        ],
        backgroundColor: [
          'rgba(255, 193, 7, 0.8)',
          'rgba(255, 137, 6, 0.8)',
          'rgba(10, 147, 150, 0.8)'
        ],
        borderColor: [
          '#ffc107',
          '#ff8906',
          '#0a9396'
        ],
        borderWidth: 3,
        hoverOffset: 10,
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a1b2',
          font: { size: 12, family: 'Inter' },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 14, 23, 0.95)',
        titleColor: '#fffffe',
        bodyColor: '#94a1b2',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            let value = context.parsed || 0;
            let total = context.dataset.data.reduce((a, b) => a + b, 0);
            let percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return label + ': ' + value + ' (' + percentage + '%)';
          }
        }
      }
    },
    cutout: '65%',
  };

  const statCards = [
    { 
      label: 'Total Residents', 
      value: stats.totalResidents, 
      subValue: `${stats.activeResidents} Active`,
      icon: <FaUsers />, 
      color: 'from-accent to-accent-light',
      link: '/admin/residents'
    },
    { 
      label: 'Total Bills', 
      value: `PKR ${stats.totalAmount.toLocaleString()}`, 
      subValue: `${stats.pendingAmount.toLocaleString()} Pending`,
      icon: <FaMoneyBillWave />, 
      color: 'from-warning to-orange-400',
      link: '/admin/billing'
    },
    { 
      label: 'Complaints', 
      value: stats.totalComplaints, 
      subValue: `${stats.pendingComplaints} Pending`,
      icon: <FaBell />, 
      color: 'from-red-400 to-pink-400',
      link: '/admin/complaints'
    },
    { 
      label: 'Visitors Today', 
      value: stats.visitorsToday, 
      subValue: `${stats.totalGuards} Guards`,
      icon: <FaShieldAlt />, 
      color: 'from-green-400 to-emerald-400',
      link: '/admin/security'
    },
  ];

  const statCards2 = [
    { 
      label: 'Collected', 
      value: `PKR ${stats.collectedAmount.toLocaleString()}`, 
      icon: <FaCheckCircle />, 
      color: 'from-success to-emerald-400'
    },
    { 
      label: 'Pending', 
      value: `PKR ${stats.pendingAmount.toLocaleString()}`, 
      icon: <FaClock />, 
      color: 'from-warning to-orange-400'
    },
    { 
      label: 'Overdue', 
      value: `PKR ${stats.overdueAmount.toLocaleString()}`, 
      icon: <FaExclamationTriangle />, 
      color: 'from-red-400 to-pink-400'
    },
    { 
      label: 'Resolved', 
      value: stats.resolvedComplaints, 
      icon: <FaCheckCircle />, 
      color: 'from-blue-400 to-cyan-400'
    },
  ];

  const getActivityIcon = (type) => {
    switch(type) {
      case 'payment': return 'bg-success/20 text-success';
      case 'complaint': return 'bg-warning/20 text-warning';
      case 'security': return 'bg-accent/20 text-accent';
      case 'billing': return 'bg-purple-400/20 text-purple-400';
      default: return 'bg-text-muted/20 text-text-muted';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent/20 border-t-accent"></div>
        <p className="text-text-muted mt-2">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-text-muted text-sm mt-1">Manage your society efficiently and keep everything in check.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Link key={index} to={stat.link} className="block group">
            <div className="glass-card p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className={`absolute -inset-1 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 blur-2xl transition-all duration-700`}></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-text-muted text-sm">{stat.label}</span>
                  <span className={`text-2xl bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.icon}
                  </span>
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-text-muted text-xs mt-1">{stat.subValue}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold flex items-center gap-2">
              <FaChartLine className="text-accent" />
              Financial Overview (PKR)
            </h3>
            <span className="text-text-muted text-xs">Last 6 months</span>
          </div>
          <div className="h-72">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <FaBell className="text-accent" />
            Complaint Status
          </h3>
          <div className="h-60 flex items-center justify-center">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards2.map((stat, index) => (
          <div key={index} className="glass-card p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-text-muted text-xs">{stat.label}</span>
              <span className={`text-lg bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.icon}
              </span>
            </div>
            <p className="text-xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold flex items-center gap-2">
            <FaDollarSign className="text-accent" />
            Monthly Collection (PKR)
          </h3>
          <span className="text-text-muted text-xs">Collected vs Pending</span>
        </div>
        <div className="h-64">
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold flex items-center gap-2">
              <FaClock className="text-accent" />
              Recent Activity
            </h3>
          </div>
          <div className="space-y-3">
            {recentActivities.length === 0 ? (
              <p className="text-text-muted text-sm">No recent activity</p>
            ) : (
              recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                  <div className={`w-2 h-2 rounded-full ${getActivityIcon(activity.type)}`}></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">
                      <span className="font-medium">{activity.user}</span>
                      <span className="text-text-muted"> {activity.action}</span>
                    </p>
                    <p className="text-text-muted text-xs">{activity.flat} • {activity.time}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getActivityIcon(activity.type)}`}>
                    {activity.type}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <FaBuilding className="text-accent" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/admin/residents" className="p-3 bg-accent/10 hover:bg-accent/20 rounded-xl text-accent font-medium text-sm transition-all duration-300 text-center group">
              <FaUsers className="mx-auto mb-1 group-hover:scale-110 transition-transform" />
              Residents
            </Link>
            <Link to="/admin/billing" className="p-3 bg-accent/10 hover:bg-accent/20 rounded-xl text-accent font-medium text-sm transition-all duration-300 text-center group">
              <FaMoneyBillWave className="mx-auto mb-1 group-hover:scale-110 transition-transform" />
              Billing
            </Link>
            <Link to="/admin/security" className="p-3 bg-accent/10 hover:bg-accent/20 rounded-xl text-accent font-medium text-sm transition-all duration-300 text-center group">
              <FaShieldAlt className="mx-auto mb-1 group-hover:scale-110 transition-transform" />
              Security
            </Link>
            <Link to="/admin/complaints" className="p-3 bg-accent/10 hover:bg-accent/20 rounded-xl text-accent font-medium text-sm transition-all duration-300 text-center group">
              <FaBell className="mx-auto mb-1 group-hover:scale-110 transition-transform" />
              Complaints
            </Link>
            <Link to="/admin/guards" className="p-3 bg-accent/10 hover:bg-accent/20 rounded-xl text-accent font-medium text-sm transition-all duration-300 text-center group">
              <FaUserCheck className="mx-auto mb-1 group-hover:scale-110 transition-transform" />
              Guards
            </Link>
            <Link to="/admin/notices" className="p-3 bg-accent/10 hover:bg-accent/20 rounded-xl text-accent font-medium text-sm transition-all duration-300 text-center group">
              <FaFileInvoice className="mx-auto mb-1 group-hover:scale-110 transition-transform" />
              Notices
            </Link>
          </div>
        </div>
      </div>

      <div className="glass-card p-4 border border-white/5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-text-muted text-xs">Total Guards</p>
            <p className="text-white font-bold text-lg">{stats.totalGuards}</p>
            <p className="text-text-muted text-xs">{stats.activeGuards} Active</p>
          </div>
          <div>
            <p className="text-text-muted text-xs">Total Notices</p>
            <p className="text-white font-bold text-lg">{stats.totalNotices}</p>
            <p className="text-text-muted text-xs">{stats.publishedNotices} Published</p>
          </div>
          <div>
            <p className="text-text-muted text-xs">Total Bookings</p>
            <p className="text-white font-bold text-lg">{stats.totalBookings}</p>
            <p className="text-text-muted text-xs">This month</p>
          </div>
          <div>
            <p className="text-text-muted text-xs">In Progress</p>
            <p className="text-white font-bold text-lg">{stats.inProgressComplaints}</p>
            <p className="text-text-muted text-xs">Complaints</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;