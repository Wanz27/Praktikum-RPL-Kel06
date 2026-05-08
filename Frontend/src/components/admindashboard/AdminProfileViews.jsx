import React, { useState, useEffect } from 'react';
import { updateAdminProfile, updateAdminPhoto } from '../../api/api';

function AdminProfileViews({ user, setUser, setModalState }) {
  const [subView, setSubView] = useState('profil');
  const [showPassword, setShowPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '', email: '', password: '', confirmPassword: '', photo: null, photoPreview: null,
  });

  useEffect(() => {
    if (subView === 'editProfil') {
      setProfileData({
        name: user?.username || '',
        email: user?.email || '',
        password: '',
        confirmPassword: '',
        photo: null,
        photoPreview: user?.photo || null,
      });
    }
  }, [subView, user]);

  const handleUpdateProfile = async () => {
    try {
      if (profileData.password && profileData.password !== profileData.confirmPassword) {
        return alert('Password dan konfirmasi password tidak cocok!');
      }

      const updatePayload = { username: profileData.name, email: profileData.email };
      if (profileData.password) updatePayload.password = profileData.password;

      const result = await updateAdminProfile(user.id_admin, updatePayload);
      let updatedUser = result.data;

      if (profileData.photo) {
        const formData = new FormData();
        formData.append('photo', profileData.photo);
        const photoResult = await updateAdminPhoto(user.id_admin, formData);
        updatedUser = photoResult.data;
      }

      localStorage.setItem('admin', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setModalState({
        isOpen: true,
        title: 'Profil Diperbarui!',
        message: 'Perubahan profil Anda telah berhasil disimpan.',
        onCloseAction: () => setSubView('profil'),
      });
    } catch (err) {
      console.error(err);
      alert(err.message || 'Terjadi kesalahan');
    }
  };

  if (subView === 'editProfil') {
    return (
      <div className="profile-layout">
        <h2 className="profile-title">Edit Profil Saya</h2>
        <div className="profile-card">
          <div
            className="profile-avatar-container edit-mode"
            onClick={() => document.getElementById('adminProfilePhotoInput').click()}
            style={{ cursor: 'pointer' }}
          >
            {profileData.photoPreview ? (
              <img src={profileData.photoPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            ) : (
              <i className="far fa-user-circle profile-avatar"></i>
            )}
            <div className="profile-avatar-edit"><i className="fas fa-camera"></i></div>
          </div>
          <input
            id="adminProfilePhotoInput"
            type="file"
            style={{ display: 'none' }}
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) setProfileData({ ...profileData, photo: file, photoPreview: URL.createObjectURL(file) });
            }}
          />

          <div className="profile-form">
            <div className="profile-field">
              <label>NAMA LENGKAP</label>
              <div className="profile-input-wrapper">
                <input type="text" className="profile-input" value={profileData.name} onChange={e => setProfileData({ ...profileData, name: e.target.value })} />
              </div>
            </div>

            <div className="profile-field">
              <label>ALAMAT EMAIL</label>
              <div className="profile-input-wrapper">
                <input type="email" className="profile-input" value={profileData.email} onChange={e => setProfileData({ ...profileData, email: e.target.value })} />
              </div>
            </div>

            <div className="profile-field">
              <label>KATA SANDI BARU</label>
              <div className="profile-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Kosongkan jika tidak ingin mengubah"
                  className="profile-input"
                  value={profileData.password}
                  onChange={e => setProfileData({ ...profileData, password: e.target.value })}
                />
                <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'} profile-input-icon`} onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}></i>
              </div>
            </div>

            <div className="profile-field">
              <label>KONFIRMASI KATA SANDI BARU</label>
              <div className="profile-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Konfirmasi kata sandi baru"
                  className="profile-input"
                  value={profileData.confirmPassword}
                  onChange={e => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                />
                <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'} profile-input-icon`} onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}></i>
              </div>
            </div>

            <button className="btn-profile-primary" onClick={handleUpdateProfile}>SIMPAN PERUBAHAN</button>
            <button className="btn-profile-secondary" onClick={() => setSubView('profil')}>Batal</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-layout">
      <h2 className="profile-title">Profil Saya</h2>
      <div className="profile-card">
        <div className="profile-avatar-container">
          {user?.photo ? (
            <img src={user.photo} alt="avatar" className="profile-avatar-img" />
          ) : (
            <i className="far fa-user-circle profile-avatar"></i>
          )}
        </div>

        <div className="profile-form">
          <div className="profile-field">
            <label>NAMA LENGKAP</label>
            <div className="profile-input-readonly">{user?.username || 'Admin'}</div>
          </div>

          <div className="profile-field">
            <label>ALAMAT EMAIL</label>
            <div className="profile-input-readonly">{user?.email || '-'}</div>
          </div>

          <div className="profile-field">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label>KATA SANDI</label>
              <span className="profile-link" style={{ cursor: 'pointer' }} onClick={() => setSubView('editProfil')}>Ubah Kata Sandi</span>
            </div>
            <div className="profile-input-wrapper">
              <input type={showPassword ? 'text' : 'password'} value={user?.password || '•••••••••••'} readOnly className="profile-input" />
              <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'} profile-input-icon`} onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}></i>
            </div>
          </div>

          <button className="btn-profile-primary" onClick={() => setSubView('editProfil')}>
            <i className="fas fa-pen" style={{ marginRight: '8px' }}></i> EDIT PROFIL
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminProfileViews;
