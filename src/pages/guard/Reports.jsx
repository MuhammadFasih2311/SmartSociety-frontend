import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaPrint, FaDownload, FaCalendar, FaClock, 
  FaArrowLeft, FaSearch, FaUser, FaShieldAlt, 
  FaChartLine, FaFileAlt, FaSpinner, FaCheckCircle,
  FaTimesCircle, FaUsers, FaBuilding
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Reports = () => {
  const [reportType, setReportType] = useState('daily');
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [stats, setStats] = useState({
    totalVisitors: 0,
    todayVisitors: 0,
    verified: 0,
    flagged: 0,
    totalGates: 0,
    activeGates: 0
  });
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';

  const reportTypes = [
    { id: 'daily', label: 'Daily Report' },
    { id: 'weekly', label: 'Weekly Report' },
    { id: 'monthly', label: 'Monthly Report' },
    { id: 'custom', label: 'Custom Range' },
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/guard/reports/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/guard/reports/generate`,
        {
          reportType,
          startDate: dateRange.start,
          endDate: dateRange.end
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setReportData(response.data.data);
        toast.success('Report generated successfully!');
      } else {
        toast.error(response.data.message || 'Failed to generate report');
      }
    } catch (error) {
      console.error('Generate report error:', error);
      toast.error(error.response?.data?.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (format) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/guard/reports/export`,
        {
          params: {
            format,
            startDate: dateRange.start,
            endDate: dateRange.end
          },
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${dateRange.start}-to-${dateRange.end}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success(`${format} report downloaded successfully!`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error(error.response?.data?.message || 'Failed to download report');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const statsCards = [
    { label: 'Total Visitors', value: stats.totalVisitors, icon: <FaUsers />, color: 'from-accent to-accent-light' },
    { label: "Today's Visitors", value: stats.todayVisitors, icon: <FaClock />, color: 'from-blue-400 to-cyan-400' },
    { label: 'Verified', value: stats.verified, icon: <FaCheckCircle />, color: 'from-success to-emerald-400' },
    { label: 'Flagged', value: stats.flagged, icon: <FaTimesCircle />, color: 'from-red-400 to-pink-400' },
    { label: 'Total Gates', value: stats.totalGates, icon: <FaBuilding />, color: 'from-purple-400 to-indigo-400' },
    { label: 'Active Gates', value: stats.activeGates, icon: <FaShieldAlt />, color: 'from-green-400 to-teal-400' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Reports</h1>
          <p className="text-text-muted text-sm mt-1">Generate and download security reports.</p>
        </div>
        <Link to="/guard/dashboard" className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm">
          <FaArrowLeft />
          Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {statsCards.map((stat, index) => (
          <div key={index} className="glass-card p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-text-muted text-xs">{stat.label}</span>
              <span className={`text-lg bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.icon}
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <FaChartLine className="text-accent" />
          Generate Report
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-text-muted text-sm mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
            >
              {reportTypes.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-text-muted text-sm mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div>
            <label className="block text-text-muted text-sm mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full px-4 py-2 bg-primary-light/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`w-full btn-primary flex items-center justify-center gap-2 px-6 py-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FaSearch />
                  Generate
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {reportData && (
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <FaFileAlt className="text-accent" />
              Report Results
            </h2>
            <span className="text-text-muted text-xs">
              Generated: {new Date(reportData.generatedAt).toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-primary/30 rounded-xl p-4">
              <p className="text-text-muted text-xs">Total Visitors</p>
              <p className="text-2xl font-bold text-white">{reportData.summary.totalVisitors}</p>
            </div>
            <div className="bg-primary/30 rounded-xl p-4">
              <p className="text-text-muted text-xs">Verified</p>
              <p className="text-2xl font-bold text-success">{reportData.summary.verified}</p>
            </div>
            <div className="bg-primary/30 rounded-xl p-4">
              <p className="text-text-muted text-xs">Flagged</p>
              <p className="text-2xl font-bold text-red-400">{reportData.summary.flagged}</p>
            </div>
            <div className="bg-primary/30 rounded-xl p-4">
              <p className="text-text-muted text-xs">Pending</p>
              <p className="text-2xl font-bold text-warning">{reportData.summary.pending}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-primary/30 rounded-xl p-4">
              <p className="text-text-muted text-xs">Peak Hour</p>
              <p className="text-xl font-bold text-white">{reportData.summary.peakHour}</p>
            </div>
            <div className="bg-primary/30 rounded-xl p-4">
              <p className="text-text-muted text-xs">Avg. Stay Time</p>
              <p className="text-xl font-bold text-white">{reportData.summary.avgStayTime}</p>
            </div>
            <div className="bg-primary/30 rounded-xl p-4">
              <p className="text-text-muted text-xs">Gate Usage</p>
              <p className="text-xl font-bold text-white">{reportData.summary.gateUsage}</p>
            </div>
            <div className="bg-primary/30 rounded-xl p-4">
              <p className="text-text-muted text-xs">Total Gates</p>
              <p className="text-xl font-bold text-white">{reportData.summary.totalGates}</p>
            </div>
          </div>

          <h3 className="text-white font-bold mb-3">Recent Visitors</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-2 px-4">Name</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-2 px-4">Flat</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-2 px-4">Status</th>
                  <th className="text-left text-text-muted text-xs font-medium uppercase tracking-wider py-2 px-4">Time</th>
                </tr>
              </thead>
              <tbody>
                {reportData.recentVisitors.map((visitor, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-2 px-4 text-white text-sm">{visitor.name}</td>
                    <td className="py-2 px-4 text-text-muted text-sm">{visitor.flat}</td>
                    <td className="py-2 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        visitor.status === 'Verified' || visitor.status === 'approved' 
                          ? 'bg-success/20 text-success' 
                          : visitor.status === 'Flagged' || visitor.status === 'rejected'
                          ? 'bg-red-400/20 text-red-400'
                          : 'bg-warning/20 text-warning'
                      }`}>
                        {visitor.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-text-muted text-sm">{visitor.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => handleDownload('CSV')}
              className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm"
            >
              <FaDownload />
              Download CSV
            </button>
            <button
              onClick={handlePrint}
              className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm"
            >
              <FaPrint />
              Print Report
            </button>
          </div>
        </div>
      )}

      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <FaDownload className="text-accent" />
          Quick Export
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleDownload('CSV')}
            className="p-4 bg-primary-light/30 border border-white/10 rounded-xl hover:border-accent/50 transition-all duration-300 text-center group"
          >
            <FaFileAlt className="text-3xl text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-white text-sm font-medium">CSV Export</p>
            <p className="text-text-muted text-xs">Download as CSV</p>
          </button>
          <button
            onClick={() => handleDownload('CSV')}
            className="p-4 bg-primary-light/30 border border-white/10 rounded-xl hover:border-accent/50 transition-all duration-300 text-center group"
          >
            <FaFileAlt className="text-3xl text-green-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-white text-sm font-medium">Excel Export</p>
            <p className="text-text-muted text-xs">Download as Excel</p>
          </button>
          <button
            onClick={handlePrint}
            className="p-4 bg-primary-light/30 border border-white/10 rounded-xl hover:border-accent/50 transition-all duration-300 text-center group"
          >
            <FaPrint className="text-3xl text-accent mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-white text-sm font-medium">Print Report</p>
            <p className="text-text-muted text-xs">Print directly</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;