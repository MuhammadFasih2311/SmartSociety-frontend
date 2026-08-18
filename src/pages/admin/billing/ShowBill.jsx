import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  FaArrowLeft, FaDownload, FaPrint, FaEye, FaEdit, FaTrash,
  FaMoneyBillWave, FaUser, FaHome, FaCalendarAlt,
  FaCheckCircle, FaClock, FaExclamationTriangle,
  FaFileInvoice, FaFilePdf
} from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ShowBill = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const billRef = useRef(null);
  const API_URL = 'https://smart-society-backend-dusky.vercel.app/api';

  useEffect(() => {
    fetchBill();
  }, [id]);

  const fetchBill = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/billing/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBill(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load bill');
      navigate('/admin/billing');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete this bill?`)) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/admin/billing/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Bill deleted successfully!');
      navigate('/admin/billing', { state: { message: 'Bill deleted successfully!' } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const generatePDF = async () => {
    if (!billRef.current) return;
    
    try {
      toast.loading('Generating PDF...', { id: 'pdf' });
      
      const element = billRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#0f0e17',
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${bill._id.slice(-6)}.pdf`);
      
      toast.success('PDF downloaded successfully!', { id: 'pdf' });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF', { id: 'pdf' });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="text-center py-12"><div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent/20 border-t-accent"></div><p className="text-text-muted mt-2">Loading...</p></div>;
  }

  if (!bill) return null;

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Paid': return { color: 'bg-success/20 text-success', icon: <FaCheckCircle /> };
      case 'Pending': return { color: 'bg-warning/20 text-warning', icon: <FaClock /> };
      case 'Overdue': return { color: 'bg-red-400/20 text-red-400', icon: <FaExclamationTriangle /> };
      default: return { color: 'bg-text-muted/20 text-text-muted', icon: null };
    }
  };

  const statusInfo = getStatusBadge(bill.status);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Bill Details</h1>
          <p className="text-text-muted text-sm mt-1">Invoice #{bill._id?.slice(-6)} - {bill.residentName}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/billing" className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm">
            <FaArrowLeft /> Back
          </Link>
          <button 
            onClick={generatePDF}
            className="bg-accent/10 hover:bg-accent/20 text-accent flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all duration-300"
          >
            <FaFilePdf /> PDF
          </button>
          <button 
            onClick={handlePrint}
            className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all duration-300"
          >
            <FaPrint /> Print
          </button>
          <Link to={`/admin/billing/edit/${bill._id}`} className="btn-primary flex items-center gap-2 px-4 py-2 text-sm">
            <FaEdit /> Edit
          </Link>
          <button onClick={handleDelete} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all duration-300">
            <FaTrash /> Delete
          </button>
        </div>
      </div>

      <div ref={billRef} className="bg-primary">
        <div className={`glass-card p-4 mb-6 border ${bill.status === 'Paid' ? 'border-success/30' : bill.status === 'Overdue' ? 'border-red-400/30' : 'border-warning/30'}`}>
          <div className="flex items-center gap-3">
            <span className={`text-xl ${statusInfo.color}`}>{statusInfo.icon}</span>
            <div>
              <span className={`text-sm font-medium ${statusInfo.color}`}>{bill.status}</span>
              {bill.paidDate && <p className="text-text-muted text-xs">Paid on {new Date(bill.paidDate).toLocaleDateString()}</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-card p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-3">
                <FaFileInvoice className="text-accent" /> Invoice Details
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted">Invoice #</span>
                <span className="text-accent font-medium">#{bill._id?.slice(-6)}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <FaUser className="text-sm" />
                </div>
                <div>
                  <p className="text-text-muted text-xs">Resident</p>
                  <p className="text-white font-medium">{bill.residentName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <FaHome className="text-sm" />
                </div>
                <div>
                  <p className="text-text-muted text-xs">Flat</p>
                  <p className="text-white font-medium">{bill.flatNumber}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <FaMoneyBillWave className="text-sm" />
                </div>
                <div>
                  <p className="text-text-muted text-xs">Amount</p>
                  <p className="text-white font-medium text-lg">PKR {bill.amount?.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <FaCalendarAlt className="text-sm" />
                </div>
                <div>
                  <p className="text-text-muted text-xs">Due Date</p>
                  <p className="text-white font-medium">{new Date(bill.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-primary/30 rounded-xl md:col-span-2">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <FaFileInvoice className="text-sm" />
                </div>
                <div>
                  <p className="text-text-muted text-xs">Description</p>
                  <p className="text-white font-medium">{bill.description || 'Monthly maintenance fee'}</p>
                </div>
              </div>
            </div>

            {bill.charges && (
              <div className="mt-6 pt-6 border-t border-white/5">
                <h3 className="text-white font-medium mb-3">Charges Breakdown</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(bill.charges).map(([key, value]) => (
                    value > 0 && (
                      <div key={key} className="flex justify-between p-2 bg-primary/30 rounded-lg">
                        <span className="text-text-muted text-sm capitalize">{key}</span>
                        <span className="text-white text-sm">PKR {value.toLocaleString()}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
              <FaMoneyBillWave className="text-accent" /> Payment Summary
            </h2>
            
            <div className="space-y-4">
              <div className="p-3 bg-primary/30 rounded-xl">
                <p className="text-text-muted text-xs">Invoice Number</p>
                <p className="text-white font-medium">#{bill._id?.slice(-6)}</p>
              </div>
              <div className="p-3 bg-primary/30 rounded-xl">
                <p className="text-text-muted text-xs">Total Amount</p>
                <p className="text-white font-bold text-xl">PKR {bill.amount?.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-primary/30 rounded-xl">
                <p className="text-text-muted text-xs">Month</p>
                <p className="text-white font-medium">{bill.month} {bill.year}</p>
              </div>
              <div className="p-3 bg-primary/30 rounded-xl">
                <p className="text-text-muted text-xs">Status</p>
                <span className={`text-sm font-medium ${statusInfo.color}`}>{bill.status}</span>
              </div>
              {bill.paidDate && (
                <div className="p-3 bg-primary/30 rounded-xl">
                  <p className="text-text-muted text-xs">Payment Date</p>
                  <p className="text-white font-medium">{new Date(bill.paidDate).toLocaleDateString()}</p>
                </div>
              )}
              {bill.lateFee > 0 && (
                <div className="p-3 bg-red-400/10 rounded-xl border border-red-400/20">
                  <p className="text-text-muted text-xs">Late Fee</p>
                  <p className="text-red-400 font-medium">PKR {bill.lateFee.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-text-muted/40 text-xs border-t border-white/5 pt-4">
          <p>Generated by SmartSociety • {new Date().toLocaleString()}</p>
        </div>
      </div>

      <style>{`
        @media print {
          .glass-card {
            background: #0f0e17 !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
          }
          .btn-secondary, .btn-primary, button {
            display: none !important;
          }
          body {
            background: #0f0e17 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ShowBill;