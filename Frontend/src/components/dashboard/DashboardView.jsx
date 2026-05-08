import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getStatusClass, formatTimeAgo } from '../../utils/formatters';

function DashboardView({ user, reports, stats, onBuatLaporan, onViewDetail, setActiveView }) {
  const navigate = useNavigate();
  const latestReports = [...reports]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  return (
    <>
      <div className="welcome-banner">
        <h1>Selamat Datang di Portal lapor.in, {user?.name}!</h1>
        <p>Pantau, kelola, dan tuntaskan setiap laporan fasilitas kampus dengan presisi demi kenyamanan bersama.</p>
        <div className="banner-actions">
          <button className="btn-banner-primary" onClick={onBuatLaporan}>
            <i className="fas fa-plus"></i> Buat Laporan Baru
          </button>
          <button className="btn-banner-secondary" onClick={() => navigate('/reports')}>
            Daftar Laporan
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon dark"><i className="fas fa-clipboard-list"></i></div>
            <span className="stat-title">Total Aduan</span>
          </div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-desc">Total Laporan Masuk</div>
        </div>
        <div className="stat-card active">
          <div className="stat-header">
            <div className="stat-icon green"><i className="fas fa-arrows-rotate"></i></div>
            <span className="stat-title">Proses Aktif</span>
          </div>
          <div className="stat-value">{stats.diproses}</div>
          <div className="stat-desc">Sedang Diproses</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon dark"><i className="fas fa-check-circle"></i></div>
            <span className="stat-title">Hasil Akhir</span>
          </div>
          <div className="stat-value">{stats.selesai}</div>
          <div className="stat-desc">Berhasil Diselesaikan</div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div>
            <h3>Aktivitas Laporan Terbaru</h3>
            <p>Daftar keluhan yang baru saja diperbarui oleh sistem</p>
          </div>
          <a href="#" className="btn-link" onClick={(e) => { e.preventDefault(); navigate('/reports'); }}>
            Lihat Semua
          </a>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID Laporan</th>
              <th>Judul Laporan</th>
              <th>Lokasi</th>
              <th>Status</th>
              <th>Waktu</th>
            </tr>
          </thead>
          <tbody>
            {latestReports.map(r => (
              <tr key={r.id}>
                <td className="td-id">#LPR-2026-{r.id}</td>
                <td><h4 className="td-title">{r.title}</h4></td>
                <td className="td-loc">{r.location}</td>
                <td>
                  <span className={`badge-status ${getStatusClass(r.status)}`}>{r.status}</span>
                </td>
                <td className="td-time">
                  {formatTimeAgo(r.createdAt)}
                  <button className="btn-icon" onClick={() => onViewDetail(r)}>
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default DashboardView;
