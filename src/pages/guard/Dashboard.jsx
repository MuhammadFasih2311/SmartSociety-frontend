import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaUser, FaKey, FaClipboardList, FaShieldAlt, 
  FaClock, FaCheckCircle, FaExclamationTriangle,
  FaArrowRight, FaSearch, FaQrcode, FaPrint,
  FaBell, FaUsers, FaCar, FaBuilding, FaChartLine,
  FaSpinner, FaTimesCircle, FaHome
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const GuardDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVisitors: 0,
    todayVisitors: 0,
    pendingVisitors: 0,
    verifiedVisitors: 0,
    flaggedVisitors: 0,
    residentVisitors: 0,
    totalGates: 0,
    activeGates: 0,
    inactiveGates: 0,
    assignedGate: 'Not Assigned',
    shift: 'Not Assigned'
  });
  const [gates, setGates] = useState([]);
  const [recentVisitors, setRecentVisitors] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState({});

  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    fetchDashboardData();
    return () => clearInterval(timer);
  }, []);

 const fetchDashboardData = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error('Please login first');
      setLoading(false);
      return;
    }

    console.log('📤 Fetching dashboard data...');
    
    const response = await axios.get(`${API_URL}/guard/dashboard`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📥 Full Response:', response.data);

    if (response.data.success) {
      const data = response.data.data;

      const backendStats = data.stats || {};
      console.log('📊 Stats from backend:', backendStats);
      console.log('🚪 Gates from backend:', data.gates);

      const mappedStats = {
        totalVisitors: backendStats.totalVisitors || 0,
        todayVisitors: backendStats.todayVisitors || 0,
        pendingVisitors: backendStats.pending || 0,
        verifiedVisitors: backendStats.verified || 0,
        flaggedVisitors: backendStats.flagged || 0,
        residentVisitors: backendStats.resident || 0,
        totalGates: backendStats.totalGates || 0,
        activeGates: backendStats.activeGates || 0,
        inactiveGates: backendStats.inactiveGates || 0,
        assignedGate: backendStats.assignedGate || 'Not Assigned',
        shift: backendStats.shift || 'Not Assigned'
      };
      
      console.log('✅ Mapped Stats:', mappedStats);
      setStats(mappedStats);

      if (data.gates && Array.isArray(data.gates) && data.gates.length > 0) {
        console.log('✅ Setting gates:', data.gates.length, 'gates');
        setGates(data.gates);
      } else {
        console.log('⚠️ No gates in response, trying to fetch from /guard/gates endpoint...');
        try {
          const gatesResponse = await axios.get(`${API_URL}/guard/gates`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (gatesResponse.data.success && gatesResponse.data.data) {
            console.log('✅ Fetched gates from /guard/gates:', gatesResponse.data.data.length);
            setGates(gatesResponse.data.data);
            setStats(prev => ({
              ...prev,
              totalGates: gatesResponse.data.stats?.total || gatesResponse.data.data.length,
              activeGates: gatesResponse.data.stats?.active || 0,
              inactiveGates: gatesResponse.data.stats?.inactive || 0
            }));
          }
        } catch (gateError) {
          console.error('❌ Failed to fetch gates from /guard/gates:', gateError);
          setGates([]);
        }
      }

      setRecentVisitors(data.recentVisitors || []);

      setTrendData(data.trendData || []);

      setHourlyData(data.hourlyData || []);

      const distribution = data.statusDistribution || {
        pending: backendStats.pending || 0,
        verified: backendStats.verified || 0,
        flagged: backendStats.flagged || 0,
        resident: backendStats.resident || 0
      };
      console.log('✅ Status Distribution:', distribution);
      setStatusDistribution(distribution);

    } else {
      toast.error(response.data.message || 'Failed to load dashboard');
    }
  } catch (error) {
    console.error('❌ Fetch dashboard error:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    toast.error('Failed to load dashboard data');
  } finally {
    setLoading(false);
  }
};
  const getStatusBadge = (status) => {
    if (!status) return 'bg-text-muted/20 text-text-muted';
    
    const statusLower = status.toLowerCase();
    switch(statusLower) {
      case 'verified':
      case 'approved':
        return 'bg-success/20 text-success';
      case 'flagged':
      case 'rejected':
        return 'bg-red-400/20 text-red-400';
      case 'pending':
        return 'bg-warning/20 text-warning';
      case 'resident':
        return 'bg-accent/20 text-accent';
      default:
        return 'bg-text-muted/20 text-text-muted';
    }
  };

  const getGateStatusBadge = (status) => {
    if (!status) return 'bg-text-muted/20 text-text-muted';
    
    switch(status) {
      case 'Active':
        return 'bg-success/20 text-success';
      case 'Maintenance':
        return 'bg-warning/20 text-warning';
      case 'Inactive':
        return 'bg-red-400/20 text-red-400';
      default:
        return 'bg-text-muted/20 text-text-muted';
    }
  };

  const statCards = [
    { label: 'Total Visitors', value: stats.totalVisitors, icon: <FaUsers />, color: 'from-accent to-accent-light' },
    { label: "Today's Visitors", value: stats.todayVisitors, icon: <FaClock />, color: 'from-blue-400 to-cyan-400' },
    { label: 'Pending Verifications', value: stats.pendingVisitors, icon: <FaKey />, color: 'from-warning to-orange-400' },
    { label: 'Verified', value: stats.verifiedVisitors, icon: <FaCheckCircle />, color: 'from-success to-emerald-400' },
    { label: 'Flagged', value: stats.flaggedVisitors, icon: <FaExclamationTriangle />, color: 'from-red-400 to-pink-400' },
    { label: 'Residents', value: stats.residentVisitors, icon: <FaHome />, color: 'from-purple-400 to-indigo-400' },
  ];

  const gateStatCards = [
    { label: 'Total Gates', value: stats.totalGates, icon: <FaBuilding />, color: 'from-accent to-accent-light' },
    { label: 'Active Gates', value: stats.activeGates, icon: <FaCheckCircle />, color: 'from-success to-emerald-400' },
    { label: 'Inactive Gates', value: stats.inactiveGates, icon: <FaTimesCircle />, color: 'from-red-400 to-pink-400' },
  ];

  const renderTrendChart = () => {
    if (!trendData || trendData.length === 0) {
      return (
        <div className="mt-4 text-center py-8">
          <p className="text-text-muted text-sm">No trend data available</p>
          <p className="text-text-muted/50 text-xs mt-1">Visitors will appear here once recorded</p>
        </div>
      );
    }

    const maxValue = Math.max(...trendData.map(d => d.count || 0), 1);
    return (
      <div className="mt-4">
        <div className="flex items-end gap-2 h-32">
          {trendData.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-accent/40 rounded-t hover:bg-accent/70 transition-all duration-300"
                style={{ 
                  height: `${((item.count || 0) / maxValue) * 100}%`,
                  minHeight: '4px'
                }}
              ></div>
              <span className="text-text-muted text-[10px] mt-1">{item.date ? item.date.slice(5) : 'N/A'}</span>
            </div>
          ))}
        </div>
        <p className="text-text-muted text-xs text-center mt-2">Last 7 Days Trend</p>
      </div>
    );
  };

  const renderHourlyChart = () => {
    if (!hourlyData || hourlyData.length === 0) {
      return (
        <div className="mt-4 text-center py-8">
          <p className="text-text-muted text-sm">No hourly data available</p>
          <p className="text-text-muted/50 text-xs mt-1">Today's visitor distribution will appear here</p>
        </div>
      );
    }

    const maxValue = Math.max(...hourlyData.map(d => d.count || 0), 1);
    return (
      <div className="mt-4">
        <div className="flex items-end gap-1 h-24 overflow-x-auto">
          {hourlyData.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center min-w-[20px]">
              <div 
                className="w-full bg-blue-400/40 rounded-t hover:bg-blue-400/70 transition-all duration-300"
                style={{ 
                  height: `${((item.count || 0) / maxValue) * 100}%`,
                  minHeight: '2px'
                }}
              ></div>
              <span className="text-text-muted text-[8px] mt-1">{item.hour || index}h</span>
            </div>
          ))}
        </div>
        <p className="text-text-muted text-xs text-center mt-2">Hourly Distribution (Today)</p>
      </div>
    );
  };

  const renderStatusDistribution = () => {
    const distribution = statusDistribution || {};
    const total = Object.values(distribution).reduce((a, b) => a + b, 0) || 1;
    const colors = {
      pending: 'bg-warning',
      verified: 'bg-success',
      flagged: 'bg-red-400',
      resident: 'bg-accent'
    };
    const labels = {
      pending: 'Pending',
      verified: 'Verified',
      flagged: 'Flagged',
      resident: 'Resident'
    };

    if (Object.keys(distribution).length === 0 || total === 0) {
      return (
        <div className="mt-4 text-center py-4">
          <p className="text-text-muted text-sm">No status data available</p>
        </div>
      );
    }

    return (
      <div className="mt-4">
        <div className="flex h-4 rounded-full overflow-hidden">
          {Object.entries(distribution).map(([key, value]) => (
            value > 0 && (
              <div 
                key={key}
                className={`${colors[key] || 'bg-text-muted'} transition-all duration-500`}
                style={{ width: `${(value / total) * 100}%` }}
                title={`${labels[key] || key}: ${value}`}
              ></div>
            )
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mt-2">
          {Object.entries(distribution).map(([key, value]) => (
            <div key={key} className="flex items-center gap-1">
              <span className={`w-3 h-3 rounded-full ${colors[key] || 'bg-text-muted'}`}></span>
              <span className="text-text-muted text-xs">{labels[key] || key}: {value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <FaSpinner className="animate-spin text-4xl text-accent mx-auto mb-4" />
        <p className="text-text-muted">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Guard Dashboard</h1>
          <p className="text-text-muted text-sm mt-1">
            Monitor and manage gate security in real-time.
            {stats.assignedGate !== 'Not Assigned' && (
              <span className="ml-2 text-accent">
                • Gate: {stats.assignedGate} • Shift: {stats.shift}
              </span>
            )}
          </p>
        </div>
        <div className="glass-card px-4 py-2 mt-2 sm:mt-0 flex items-center gap-3">
          <FaClock className="text-accent" />
          <span className="text-white font-medium">
            {currentTime.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit',
              hour12: true 
            })}
          </span>
          <span className="text-text-muted text-sm">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {statCards.map((stat, index) => (
          <div key={index} className="glass-card p-4 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <div className={`absolute -inset-1 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 blur-2xl transition-all duration-700`}></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                <span className="text-text-muted text-xs">{stat.label}</span>
                <span className={`text-lg bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.icon}
                </span>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {gateStatCards.map((stat, index) => (
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
        <h3 className="text-white font-bold flex items-center gap-2">
          <FaShieldAlt className="text-accent" />
          Visitor Status Distribution
        </h3>
        {renderStatusDistribution()}
      </div>

      <div className="glass-card p-6 mb-6">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <FaShieldAlt className="text-accent" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link to="/guard/visitor/create" className="p-3 bg-accent/10 hover:bg-accent/20 rounded-xl text-accent font-medium text-sm transition-all duration-300 text-center group">
            <FaUser className="mx-auto mb-1 group-hover:scale-110 transition-transform" />
            Add Visitor
          </Link>
          <Link to="/guard/verify" className="p-3 bg-accent/10 hover:bg-accent/20 rounded-xl text-accent font-medium text-sm transition-all duration-300 text-center group">
            <FaSearch className="mx-auto mb-1 group-hover:scale-110 transition-transform" />
            Verify Pass
          </Link>
          <Link to="/guard/logs" className="p-3 bg-accent/10 hover:bg-accent/20 rounded-xl text-accent font-medium text-sm transition-all duration-300 text-center group">
            <FaClipboardList className="mx-auto mb-1 group-hover:scale-110 transition-transform" />
            Gate Logs
          </Link>
          <Link to="/guard/report" className="p-3 bg-accent/10 hover:bg-accent/20 rounded-xl text-accent font-medium text-sm transition-all duration-300 text-center group">
            <FaPrint className="mx-auto mb-1 group-hover:scale-110 transition-transform" />
            Reports
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold flex items-center gap-2">
              <FaUsers className="text-accent" />
              Recent Visitors
            </h3>
          </div>
          <div className="space-y-3">
            {recentVisitors.length === 0 ? (
              <p className="text-text-muted text-center py-4">No recent visitors</p>
            ) : (
              recentVisitors.slice(0, 5).map((visitor, index) => {
                const displayName = visitor.name || visitor.visitorName || 'Unknown';
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                        <FaUser className="text-sm" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{displayName}</p>
                        <div className="flex items-center gap-2 text-xs text-text-muted">
                          <span>Flat {visitor.flatNumber || 'N/A'}</span>
                          <span>•</span>
                          <span>{visitor.entryTime || (visitor.createdAt ? new Date(visitor.createdAt).toLocaleTimeString() : 'N/A')}</span>
                          {visitor.vehicleNumber && visitor.vehicleNumber !== 'N/A' && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <FaCar className="text-accent text-xs" />
                                {visitor.vehicleNumber}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(visitor.status)}`}>
                      {visitor.status || 'pending'}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold flex items-center gap-2">
              <FaBuilding className="text-accent" />
              Gate Status
            </h3>
            <span className="text-xs text-text-muted">Live</span>
          </div>
          <div className="space-y-3">
            {gates.length === 0 ? (
              <p className="text-text-muted text-center py-4">No gates configured</p>
            ) : (
              gates.slice(0, 5).map((gate, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                  <div>
                    <p className="text-white text-sm font-medium">{gate.name}</p>
                    <p className="text-text-muted text-xs">Guard: {gate.guard || gate.guardName || 'N/A'}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getGateStatusBadge(gate.status)}`}>
                    {gate.status}
                  </span>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-text-muted text-xs">
              {stats.activeGates} of {stats.totalGates} gates active
            </span>
            <Link to="/guard/gates" className="text-accent text-sm hover:text-accent-light transition-colors flex items-center gap-1">
              <FaShieldAlt className="text-xs" />
              Manage Gates
            </Link>
          </div>
        </div>
      </div>

      {stats.pendingVisitors > 0 && (
        <div className="glass-card p-6 mt-6 border-warning/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center text-warning">
              <FaBell className="text-lg" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Pending Verifications</p>
              <p className="text-text-muted text-sm">
                {stats.pendingVisitors} visitor(s) waiting for verification
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuardDashboard;