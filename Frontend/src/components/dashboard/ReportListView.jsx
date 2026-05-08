import React, { useState } from 'react';
import { getStatusClass, formatDate } from '../../utils/formatters';

function ReportListView({ reports, onBuatLaporan, onViewDetail }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const total = reports.length;
  const diproses = reports.filter(r => r.status?.toLowerCase() === 'diproses').length;
  const selesai = reports.filter(r => r.status?.toLowerCase() === 'selesai').length;

  const filtered = reports
    .filter(r =>
      r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReports = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <h2 className="page-title" style={{ margin: 0 }}>Daftar Laporan Anda</h2>
        <button className="buat-modal-btn-submit" onClick={onBuatLaporan}>
          <i className="fas fa-plus"></i> Buat Laporan
        </button>
      </div>
      <p className="page-desc" style={{ maxWidth: '700px' }}>
        Pantau perkembangan setiap laporan fasilitas yang telah Anda ajukan.
      </p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Laporan</span>
            <div className="stat-icon light"><i className="fas fa-clipboard-list"></i></div>
          </div>
          <div className="stat-value">{total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Sedang Diproses</span>
            <div className="stat-icon light" style={{ color: '#0f766e', backgroundColor: '#ccfbf1' }}>
              <i className="fas fa-arrows-rotate"></i>
            </div>
          </div>
          <div className="stat-value" style={{ color: '#0f766e' }}>{diproses}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Selesai</span>
            <div className="stat-icon light" style={{ color: '#c2410c', backgroundColor: '#ffedd5' }}>
              <i className="fas fa-check-circle"></i>
            </div>
          </div>
          <div className="stat-value" style={{ color: '#c2410c' }}>{selesai}</div>
        </div>
      </div>

      <div className="list-layout">
        <div className="list-main">
          <div className="table-container">
            <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Riwayat Aktivitas</h3>
              <div className="search-container" style={{ margin: '0 20px', flex: 1, maxWidth: '400px' }}>
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Cari laporan..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>ID Laporan</th>
                  <th>Judul & Tingkat Kerusakan</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentReports.map(r => (
                  <tr key={r.id}>
                    <td className="td-id">#LPR-2026-{r.id}</td>
                    <td>
                      <h4 className="td-title">{r.title}</h4>
                      <p className="td-desc">{r.category}</p>
                    </td>
                    <td className="td-time">{formatDate(r.createdAt)}</td>
                    <td>
                      <span className={`badge-status ${getStatusClass(r.status)}`}>{r.status}</span>
                    </td>
                    <td>
                      <a href="#" className="btn-link" onClick={(e) => { e.preventDefault(); onViewDetail(r); }}>
                        Lihat Detail <i className="fas fa-chevron-right" style={{ marginLeft: '4px' }}></i>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <div className="page-info">
                Menampilkan {currentReports.length} dari {filtered.length} laporan
              </div>
              <div className="page-numbers">
                <div
                  className="page-num"
                  style={{ border: '1px solid #e2e8f0', backgroundColor: 'white', cursor: currentPage > 1 ? 'pointer' : 'not-allowed', opacity: currentPage > 1 ? 1 : 0.5 }}
                  onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                >
                  <i className="fas fa-chevron-left" style={{ color: '#cbd5e1' }}></i>
                </div>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                  <div
                    key={num}
                    className={`page-num ${currentPage === num ? 'active' : ''}`}
                    onClick={() => setCurrentPage(num)}
                    style={{ border: currentPage === num ? 'none' : '1px solid #e2e8f0', backgroundColor: currentPage === num ? '' : 'white', cursor: 'pointer' }}
                  >
                    {num}
                  </div>
                ))}
                <div
                  className="page-num"
                  style={{ border: '1px solid #e2e8f0', backgroundColor: 'white', cursor: currentPage < totalPages ? 'pointer' : 'not-allowed', opacity: currentPage < totalPages ? 1 : 0.5 }}
                  onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                >
                  <i className="fas fa-chevron-right" style={{ color: '#cbd5e1' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReportListView;
