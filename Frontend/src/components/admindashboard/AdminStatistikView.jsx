import React, { useState } from 'react';

function AdminStatistikView({ reports }) {
  const [statistikPeriod, setStatistikPeriod] = useState('semua');
  const [openDropdown, setOpenDropdown] = useState(false);

  const now = new Date();
  const filtered = reports.filter(r => {
    if (statistikPeriod === 'semua') return true;
    const reportDate = new Date(r.createdAt);
    if (statistikPeriod === 'hari_ini') return reportDate.toDateString() === now.toDateString();
    if (statistikPeriod === 'minggu_ini') {
      const today = new Date();
      const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      firstDayOfWeek.setHours(0, 0, 0, 0);
      return reportDate >= firstDayOfWeek;
    }
    if (statistikPeriod === 'bulan_ini') return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear();
    if (statistikPeriod === 'tahun_ini') return reportDate.getFullYear() === now.getFullYear();
    return true;
  });

  const total = filtered.length;
  const selesai = filtered.filter(r => r.status?.toLowerCase() === 'selesai').length;
  const diproses = filtered.filter(r => r.status?.toLowerCase() === 'diproses').length;
  const pending = filtered.filter(r => r.status?.toLowerCase() === 'pending').length;
  const ditolak = filtered.filter(r => r.status?.toLowerCase() === 'ditolak').length;
  const berat = filtered.filter(r => r.category?.toLowerCase() === 'berat').length;
  const sedang = filtered.filter(r => r.category?.toLowerCase() === 'sedang').length;
  const ringan = filtered.filter(r => r.category?.toLowerCase() === 'ringan').length;

  const persentaseSelesai = total === 0 ? 0 : ((selesai / total) * 100).toFixed(1);
  const pctSelesai = total === 0 ? 0 : Math.round((selesai / total) * 100);
  const pctProses = total === 0 ? 0 : Math.round((diproses / total) * 100);
  const pctPending = total === 0 ? 0 : Math.round((pending / total) * 100);
  const pctDitolak = total === 0 ? 0 : Math.round((ditolak / total) * 100);
  const maxKategori = Math.max(berat, sedang, ringan, 1);

  const periodOptions = [
    { value: 'semua', label: 'Semua Waktu' },
    { value: 'hari_ini', label: 'Hari Ini' },
    { value: 'minggu_ini', label: 'Minggu Ini' },
    { value: 'bulan_ini', label: 'Bulan Ini' },
    { value: 'tahun_ini', label: 'Tahun Ini' },
  ];
  const currentPeriodLabel = periodOptions.find(o => o.value === statistikPeriod)?.label;

  return (
    <>
      <div className="admin-header">
        <div>
          <h1 className="admin-title" style={{ fontSize: '2.2rem' }}>Resolusi Fasilitas</h1>
          <p className="admin-desc" style={{ marginTop: '8px', color: '#475569', lineHeight: 1.5 }}>
            Analisis pemeliharaan infrastruktur kampus Universitas Diponegoro<br />
            Data diperbarui secara real-time berdasarkan laporan masuk.
          </p>
        </div>
        <div style={{ position: 'relative' }}>
          <button
            className="btn-dark-blue"
            onClick={() => setOpenDropdown(!openDropdown)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 24px' }}
          >
            <i className="far fa-calendar-alt"></i>
            {currentPeriodLabel}
            <i className={`fas fa-chevron-${openDropdown ? 'up' : 'down'}`} style={{ marginLeft: '4px', fontSize: '0.8rem' }}></i>
          </button>
          {openDropdown && (
            <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: '#1a3252', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)', padding: '8px', zIndex: 50, width: '200px', border: '1px solid #274b7a' }}>
              {periodOptions.map(opt => (
                <div
                  key={opt.value}
                  onClick={() => { setStatistikPeriod(opt.value); setOpenDropdown(false); }}
                  style={{ padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', color: 'white', background: statistikPeriod === opt.value ? '#274b7a' : 'transparent', fontWeight: statistikPeriod === opt.value ? '700' : '500', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}
                >
                  {opt.label}
                  {statistikPeriod === opt.value && <i className="fas fa-check" style={{ fontSize: '0.8rem', color: '#a5f3fc' }}></i>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="stats-layout">
        <div className="stats-main">
          <div className="stats-row">
            <div className="stat-card-white">
              <div className="stat-label-light">EFISIENSI PENYELESAIAN</div>
              <div className="stat-val-huge">{persentaseSelesai}%</div>
              <div className="stat-trend green"><i className="fas fa-arrow-trend-up"></i> Data Real-time</div>
              <i className="fas fa-check-circle bg-icon"></i>
            </div>
            <div className="stat-card-dark">
              <div className="stat-label-light" style={{ color: '#94a3b8' }}>TOTAL LAPORAN</div>
              <div className="stat-val-huge" style={{ color: 'white' }}>{total}</div>
              <div className="stat-desc-dark">Keseluruhan<br />Laporan</div>
            </div>
          </div>

          <div className="stat-card-white mt-20">
            <div className="card-header-flex">
              <h3 className="card-title-sm">Tingkat Kerusakan</h3>
              <i className="fas fa-chart-bar" style={{ color: '#cbd5e1' }}></i>
            </div>
            <div className="bar-chart-container">
              {[{ label: 'Berat', val: berat }, { label: 'Sedang', val: sedang }, { label: 'Ringan', val: ringan }].map(({ label, val }) => (
                <div key={label} className="bar-item">
                  <div className="bar-label-row">
                    <span className="bar-label">{label}</span>
                    <span className="bar-val">{val} Laporan</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${(val / maxKategori) * 100}%`, backgroundColor: '#1a3252' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="stats-side">
          <div className="stat-card-side">
            <h3 className="card-title-sm">Status Penyelesaian</h3>
            <p className="card-desc-sm">Distribusi kondisi laporan saat ini</p>
            <div className="donut-chart-wrapper">
              <div className="donut-chart" style={{
                background: `conic-gradient(#0f766e 0% ${pctSelesai}%, #fb923c ${pctSelesai}% ${pctSelesai + pctProses}%, #1a3252 ${pctSelesai + pctProses}% ${pctSelesai + pctProses + pctPending}%, #ef4444 ${pctSelesai + pctProses + pctPending}% 100%)`
              }}>
                <div className="donut-hole">
                  <div className="donut-val">{selesai}</div>
                  <div className="donut-label">SELESAI</div>
                </div>
              </div>
            </div>
            <div className="donut-legend">
              {[
                { color: '#0f766e', label: 'Selesai', pct: pctSelesai },
                { color: '#fb923c', label: 'Dalam Proses', pct: pctProses },
                { color: '#1a3252', label: 'Pending', pct: pctPending },
                { color: '#ef4444', label: 'Ditolak', pct: pctDitolak },
              ].map(({ color, label, pct }) => (
                <div key={label} className="legend-item">
                  <div className="legend-marker" style={{ backgroundColor: color }}></div>
                  <span className="legend-label">{label}</span>
                  <span className="legend-val">{pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminStatistikView;
