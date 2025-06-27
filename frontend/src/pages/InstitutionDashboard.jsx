import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import '../styles/InstitutionDashboard.css';

const InstitutionDashboard = () => {
  const [view, setView] = useState('menu'); // menu | issue | list
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    course: '',
    issuedDate: '',
    receiverEmail: '',
    file: null
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/certificate/issued`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setCertificates(data.certificates);
      } else {
        setError(data.message || 'Failed to fetch certificates');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'list') {
      fetchCertificates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleIssueCertificate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!formData.file) {
      setError('Please upload a certificate file');
      return;
    }
    try {
      setLoading(true);
      const body = new FormData();
      Object.entries(formData).forEach(([key, value]) => body.append(key, value));
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/certificate/issue`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Certificate issued successfully');
        setFormData({
          studentName: '',
          course: '',
          issuedDate: '',
          receiverEmail: '',
          file: null
        });
      } else {
        setError(data.message || 'Issuing certificate failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (id) => {
    if (!window.confirm('Revoke this certificate?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/certificate/${id}/revoke`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setCertificates((prev) => prev.map((c) => (c._id === id ? data.certificate : c)));
      } else {
        alert(data.message || 'Revoke failed');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleDownload = async (id) => {
    try {
      console.log('Attempting to download certificate with ID:', id);
      // Validate if the ID exists in the certificates list
      const certificate = certificates.find(c => c._id === id);
      if (!certificate) {
        alert('Certificate not found in local data. Please refresh the list.');
        console.error('Certificate ID not found in local data:', id);
        return;
      }
      console.log('Certificate found in local data:', certificate);
      // Try the original endpoint
      let downloadUrl = `${import.meta.env.VITE_API_URL}/api/certificate/${id}/download`;
      console.log('API URL (Attempt 1):', downloadUrl);
      console.log('Full environment variable VITE_API_URL:', import.meta.env.VITE_API_URL);
      console.log('Token:', token ? 'Token present' : 'Token missing');
      let res = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/pdf'
        },
        redirect: 'manual' // Handle redirects manually to log and debug
      });
      console.log('Response status (Attempt 1):', res.status);
      console.log('Response headers (Attempt 1):', Object.fromEntries([...res.headers.entries()]));
      // Check for redirect status (302)
      if (res.status === 302) {
        const redirectUrl = res.headers.get('location');
        console.log('Redirect detected, URL:', redirectUrl);
        // Follow the redirect manually
        res = await fetch(redirectUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/pdf'
          }
        });
        console.log('Response status after redirect:', res.status);
        console.log('Response headers after redirect:', Object.fromEntries([...res.headers.entries()]));
        if (!res.ok) {
          const text = await res.text();
          console.error('Error response text after redirect:', text);
          alert(`Download failed after redirect: ${res.status} - ${text || 'Unknown error'}`);
          return;
        }
      } else if (!res.ok) {
        const text = await res.text();
        console.error('Error response text (Attempt 1):', text);
        alert(`Download failed (Attempt 1): ${res.status} - ${text || 'Unknown error'}`);
        // If the first attempt fails with 404, try an alternative endpoint
        if (res.status === 404) {
          downloadUrl = `${import.meta.env.VITE_API_URL}/api/certificates/${id}/download`;
          console.log('API URL (Attempt 2 - Alternative Endpoint):', downloadUrl);
          res = await fetch(downloadUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/pdf'
            }
          });
          console.log('Response status (Attempt 2):', res.status);
          console.log('Response headers (Attempt 2):', Object.fromEntries([...res.headers.entries()]));
          if (!res.ok) {
            const text2 = await res.text();
            console.error('Error response text (Attempt 2):', text2);
            alert(`Download failed (Attempt 2): ${res.status} - ${text2 || 'Unknown error'}`);
            // If both API attempts fail, try direct IPFS download as a workaround
            if (certificate.ipfsHash) {
              downloadUrl = `https://gateway.pinata.cloud/ipfs/${certificate.ipfsHash}`;
              console.log('API URL (Attempt 3 - Direct IPFS Download):', downloadUrl);
              res = await fetch(downloadUrl, {
                method: 'GET',
                headers: {
                  'Accept': 'application/pdf'
                }
              });
              console.log('Response status (Attempt 3):', res.status);
              console.log('Response headers (Attempt 3):', Object.fromEntries([...res.headers.entries()]));
              if (!res.ok) {
                const text3 = await res.text();
                console.error('Error response text (Attempt 3):', text3);
                alert(`Download failed (Attempt 3 - IPFS): ${res.status} - ${text3 || 'Unknown error'}`);
                return;
              }
            } else {
              alert('No IPFS hash available for direct download.');
              console.error('No IPFS hash in certificate data for ID:', id);
              return;
            }
          }
        } else {
          return;
        }
      }
      const blob = await res.blob();
      console.log('Blob received, size:', blob.size);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      console.log('Download initiated');
    } catch (err) {
      console.error('Network error during download:', err.message);
      alert(`Network error: ${err.message}`);
    }
  };

  const renderMenu = () => (
    <div className="dashboard-actions">
      <div className="action-card">
        <h2>Issue Certificate</h2>
        <p>Upload and issue a new certificate.</p>
        <button onClick={() => setView('issue')}>Issue New</button>
      </div>
      <div className="action-card">
        <h2>View Issued Certificates</h2>
        <p>See all certificates you've issued.</p>
        <button onClick={() => setView('list')}>View List</button>
      </div>
    </div>
  );

  const renderIssueForm = () => (
    <div>
      <button onClick={() => setView('menu')} style={{ marginBottom: '1rem' }}>
        &larr; Back
      </button>
      <h2>Issue Certificate</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleIssueCertificate} className="issue-form" encType="multipart/form-data">
        <div className="form-group">
          <label>Student Name</label>
          <input name="studentName" value={formData.studentName} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Course</label>
          <input name="course" value={formData.course} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Issued Date</label>
          <input type="date" name="issuedDate" value={formData.issuedDate} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Receiver Email</label>
          <input type="email" name="receiverEmail" value={formData.receiverEmail} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Certificate File (PDF)</label>
          <input type="file" name="file" accept=".pdf" onChange={handleInputChange} required />
        </div>
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Issuing...' : 'Issue Certificate'}
        </button>
      </form>
    </div>
  );

  const renderList = () => (
    <div className="certificate-list-container">
      <button className="back-button" onClick={() => setView('menu')}>Back to Menu</button>
      <h2>Issued Certificates</h2>
      {certificates.length === 0 ? (
        <p>No certificates issued yet.</p>
      ) : (
        <div className="certificate-list">
          <table className="certificate-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Course</th>
                <th>Issue Date</th>
                <th>Status</th>
                <th>Verification Code</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((c) => (
                <tr key={c._id}>
                  <td>{c.studentName}</td>
                  <td>{c.courseName}</td>
                  <td>{new Date(c.issueDate).toLocaleDateString()}</td>
                  <td className={c.revoked ? 'revoked' : ''}>{c.revoked ? 'Revoked' : 'Active'}</td>
                  <td>{c.verificationCode}</td>
                  <td>
                    {!c.revoked && (
                      <button style={{ marginRight: '0.5rem' }} onClick={() => handleRevoke(c._id)}>
                        Revoke
                      </button>
                    )}
                    <button onClick={() => handleDownload(c._id)}>
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="dashboard-container">
      <h1>Institution Dashboard</h1>
      {view === 'menu' && renderMenu()}
      {view === 'issue' && renderIssueForm()}
      {view === 'list' && renderList()}
    </div>
  );
};

export default InstitutionDashboard;
