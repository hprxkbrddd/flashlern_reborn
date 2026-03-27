import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/imageUtils';
import api from '../utils/api';
import { setAvatar } from '../utils/auth';

function AvatarUploader({ initialImage, onClose, onUploaded }) {
  const [imageSrc, setImageSrc] = useState(initialImage || null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setImageSrc(reader.result.toString() || null);
  };

  const onCropComplete = useCallback((area, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) {
      setError('Choose and crop an image first');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { blob, url } = await getCroppedImg(imageSrc, croppedAreaPixels);
      const form = new FormData();
      form.append('file', blob, 'file.jpg');

      const res = await api.post('/profile/avatar', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // If backend returns avatar URL, use it. Otherwise try to use created blob URL
      const avatarUrl = res?.data?.avatarUrl || res?.data?.url || url;

      // Save to local storage so header can read it
      setAvatar(avatarUrl);

      if (onUploaded) onUploaded(avatarUrl);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
      if (onClose) onClose();
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ width: 520, maxWidth: '96%', background: '#fff', borderRadius: 12, padding: 16 }}>
        <h3 style={{ margin: '0 0 12px 0' }}>Upload and crop avatar</h3>
        <div style={{ marginBottom: 12 }}>
          <input type="file" accept="image/*" onChange={onFileChange} />
        </div>

        <div style={{ position: 'relative', width: '100%', height: 320, background: '#f3f4f6', borderRadius: 8, overflow: 'hidden' }}>
          {imageSrc ? (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af' }}>
              Choose an image to start cropping
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            Zoom
            <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
          </label>
        </div>

        {error && <p style={{ color: '#dc2626', marginTop: 8 }}>{error}</p>}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
          <button onClick={onClose} style={{ padding: '8px 12px', borderRadius: 6, background: '#f3f4f6', border: 'none', cursor: 'pointer' }} disabled={loading}>Cancel</button>
          <button onClick={handleUpload} style={{ padding: '8px 12px', borderRadius: 6, background: '#10b981', color: '#fff', border: 'none', cursor: 'pointer' }} disabled={loading}>{loading ? 'Uploading...' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
}

export default AvatarUploader;
