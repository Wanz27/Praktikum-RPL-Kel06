import React, { useState } from 'react';
import { getStatusClass, formatTimeAgo } from '../../utils/formatters';

function AdminReportListView({ reports, onViewDetail }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const total = reports.length;
  const diproses = reports.filter(r => r.status?.toLowerCase() === 'diproses').length;
  const selesai = reports.filter(r => r.status?.toLowerCase() === 'selesai').length;

  const filtered = reports.filter(r => {
    const matchSearch =
      r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKategori = filterKategori === 'Semua' || r.category?.toLowerCase() === filterKategori.toLowerCase();
    const matchStatus = filterStatus === 'Semua' || r.status?.toLowerCase() === filterStatus.toLowerCase();
    return matchSearch && matchKategori && matchStatus;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const currentReports = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const resetPage = () => setCurrentPage(1);

  return (
    <>
      <h2 className="admin-page-title">Kelola Laporan</h2>

      <div className="admin-workload-grid" style={{ gridTemplateColumns: '1fr' }}>
        <div className="workload-card-main">
          <h3 className="workload-title">Beban kerja admin saat ini berada di level optimal.</h3>
          <div className="workload-stats">
            <div className="workload-stat-item">
              <span className="workload-label">TOTAL LAPORAN</span>
              <span className="workload-val">{total}</span>
            </div>
            <div className="workload-stat-item">
              <span className="workload-label">SEDANG PROSES</span>
              <span className="workload-val">{diproses}</span>
            </div>
            <div className="workload-stat-item">
              <span className="workload-label">SELESAI</span>
              <span className="workload-val" style={{ color: '#67e8f9' }}>{selesai}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1a3252' }}>Daftar Antrean Laporan</h3>
          <div className="search-container" style={{ margin: '0 20px', flex: 1, maxWidth: '400px' }}>
            <i className="fas fa-search"></i>
            <input
              type="text"
              className="search-input"
              placeholder="Cari laporan..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); resetPage(); }}
            />
          </div>
          <div className="table-filters" style={{ display: 'flex', gap: '4px', position: 'relative' }}>
            <button
              className={`filter-btn ${filterKategori === 'Semua' && filterStatus === 'Semua' ? 'active' : ''}`}
              onClick={() => { setFilterKategori('Semua'); setFilterStatus('Semua'); resetPage(); setOpenDropdown(null); }}
            >Semua</button>

            <div style={{ position: 'relative' }}>
              <button
                className={`filter-btn ${filterKategori !== 'Semua' ? 'active' : ''}`}
                onClick={() => setOpenDropdown(openDropdown === 'kategori' ? null : 'kategori')}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {filterKategori === 'Semua' ? 'Tingkat Kerusakan' : filterKategori}
                <i className={`fas fa-chevron-${openDropdown === 'kategori' ? 'up' : 'down'}`} style={{ fontSize: '0.7rem' }}></i>
              </button>
              {openDropdown === 'kategori' && (
                <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '8px', zIndex: 10, width: '200px' }}>
                  {['Semua', 'Berat', 'Sedang', 'Ringan'].map(opt => (
                    <div
                      key={opt}
                      onClick={() => { setFilterKategori(opt); setOpenDropdown(null); resetPage(); }}
                      style={{ padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', color: filterKategori === opt ? '#0f766e' : '#475569', background: filterKategori === opt ? '#f0fdfa' : 'transparent', fontWeight: filterKategori === opt ? '600' : '500' }}
                    >
                      {opt === 'Semua' ? 'Semua Tingkat Kerusakan' : opt}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ position: 'relative' }}>
              <button
                className={`filter-btn ${filterStatus !== 'Semua' ? 'active' : ''}`}
                onClick={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {filterStatus === 'Semua' ? 'Status' : filterStatus}
                <i className={`fas fa-chevron-${openDropdown === 'status' ? 'up' : 'down'}`} style={{ fontSize: '0.7rem' }}></i>
              </button>
              {openDropdown === 'status' && (
                <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '8px', zIndex: 10, width: '140px' }}>
                  {['Semua', 'Pending', 'Diproses', 'Selesai', 'Ditolak'].map(opt => (
                    <div
                      key={opt}
                      onClick={() => { setFilterStatus(opt); setOpenDropdown(null); resetPage(); }}
                      style={{ padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', color: filterStatus === opt ? '#0f766e' : '#475569', background: filterStatus === opt ? '#f0fdfa' : 'transparent', fontWeight: filterStatus === opt ? '600' : '500' }}
                    >
                      {opt === 'Semua' ? 'Semua Status' : opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style={{ width: '15%' }}>ID LAPORAN</th>
              <th style={{ width: '35%' }}>JUDUL & LOKASI</th>
              <th style={{ width: '15%' }}>WAKTU MASUK</th>
              <th style={{ width: '10%' }}>TINGKAT KERUSAKAN</th>
              <th style={{ width: '15%' }}>STATUS</th>
              <th style={{ width: '10%' }}>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {currentReports.map(r => (
              <tr key={r.id}>
                <td className="td-id" style={{ color: '#1a3252', whiteSpace: 'nowrap', fontSize: '0.85rem' }}>#LPR-2026-{r.id}</td>
                <td>
                  <h4 className="td-title" style={{ fontSize: '0.9rem' }}>{r.title}</h4>
                  <p className="td-desc" style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>{r.location}</p>
                </td>
                <td className="td-time" style={{ fontSize: '0.8rem' }}>{formatTimeAgo(r.createdAt)}</td>
                <td><span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#334155' }}>{r.category}</span></td>
                <td><span className={`badge-status ${getStatusClass(r.status)}`} style={{ fontSize: '0.65rem' }}>{r.status?.toUpperCase()}</span></td>
                <td>
                  <a href="#" className="btn-link" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
                    onClick={(e) => { e.preventDefault(); onViewDetail(r); }}>
                    Lihat Detail <i className="fas fa-chevron-right" style={{ fontSize: '0.7rem' }}></i>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <div className="page-info">Menampilkan {currentReports.length} dari {filtered.length} laporan</div>
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
                style={{ border: currentPage === num ? 'none' : '1px solid #e2e8f0', backgroundColor: currentPage === num ? '' : 'white', cursor: 'pointer' }}
                onClick={() => setCurrentPage(num)}
              >
                {num}
              </div>
            ))}
            <div
              className="page-num"
              style={{ border: '1px solid #e2e8f0', backgroundColor: 'white', cursor: currentPage < totalPages ? 'pointer' : 'not-allowed', opacity: currentPage < totalPages ? 1 : 0.5 }}
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
            >
              <i className="fas fa-chevron-right" style={{ color: '#64748b' }}></i>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminReportListView;
