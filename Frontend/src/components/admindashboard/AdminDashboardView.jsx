import React from 'react';
import { getStatusClass } from '../../utils/formatters';

function AdminDashboardView({ reports, user, onViewDetail, setActiveView }) {
  const total = reports.length;
  const urgent = reports.filter(r => r.category?.toLowerCase() === 'berat').length;
  const latestReports = [...reports]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  return (
    <>
      <div className="admin-header">
        <div>
          <div className="admin-subtitle">SISTEM MANAJEMEN FASILITAS, UNIVERSITAS DIPONEGORO</div>
          <h1 className="admin-title">Selamat Datang, {user?.username || 'Admin'}</h1>
        </div>
        <div className="admin-date-btn">
          <i className="far fa-calendar-alt"></i>{' '}
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrapper blue">
            <i className="far fa-file-alt"></i>
          </div>
          <div>
            <div className="admin-stat-label">Total Laporan</div>
            <div className="admin-stat-value">{total}</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrapper red">
            <i className="fas fa-exclamation"></i>
          </div>
          <div>
            <div className="admin-stat-label">Berat</div>
            <div className="admin-stat-value">{urgent}</div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fas fa-list" style={{ color: '#1a3252' }}></i>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Laporan Terbaru</h3>
          </div>
          <a href="#" className="btn-link" style={{ fontSize: '0.85rem' }} onClick={(e) => { e.preventDefault(); setActiveView('kelola'); }}>
            Lihat Semua <i className="fas fa-arrow-right" style={{ marginLeft: '4px' }}></i>
          </a>
        </div>
        <table>
          <thead>
            <tr>
              <th style={{ width: '20%' }}>ID LAPORAN</th>
              <th style={{ width: '40%' }}>JUDUL & TINGKAT KERUSAKAN</th>
              <th style={{ width: '25%' }}>STATUS</th>
              <th style={{ width: '15%' }}>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {latestReports.map(r => (
              <tr key={r.id}>
                <td className="td-id" style={{ color: '#64748b' }}>#LPR-2026-{r.id}</td>
                <td>
                  <h4 className="td-title">{r.title}</h4>
                  <p className="td-desc">{r.category}</p>
                </td>
                <td><span className={`badge-status ${getStatusClass(r.status)}`}>{r.status?.toUpperCase()}</span></td>
                <td>
                  <a href="#" className="btn-link" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
                    onClick={(e) => { e.preventDefault(); onViewDetail(r); }}>
                    Lihat Detail <i className="fas fa-chevron-right" style={{ fontSize: '0.7rem' }}></i>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AdminDashboardView;
