import React, { useEffect, useState } from 'react';

const BACKEND_URL = 'https://ngo-backend-cgh3.onrender.com';

const CAMPAIGN_IMAGES = {
  'Clean Water for Rural Villages': 'https://images.unsplash.com/photo-1574482620826-40685ca5ebd2?auto=format&fit=crop&w=800&q=80',
  'Books & Education for Kids': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
  'Animal Shelter Food & Care': 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80'
};

const CAMPAIGN_TAGS = {
  'Clean Water for Rural Villages': 'Infrastructure',
  'Books & Education for Kids': 'Education',
  'Animal Shelter Food & Care': 'Animal Welfare'
};

export default function App() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [amount, setAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCampaigns = () => {
    fetch(`${BACKEND_URL}/api/campaigns`)
      .then((res) => res.json())
      .then((data) => setCampaigns(data))
      .catch((err) => console.error('Fetch error:', err));
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const totalRaised = campaigns.reduce((acc, c) => acc + Number(c.raised_amount || 0), 0);
  const totalGoal = campaigns.reduce((acc, c) => acc + Number(c.target_amount || 0), 0);

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/donations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign_id: selectedCampaign.id,
          amount: parseFloat(amount),
          donor_name: donorName || 'Anonymous',
        }),
      });

      if (res.ok) {
        setMessage(`🎉 Thank you, ${donorName || 'Generous Supporter'}! Your gift of ₹${Number(amount).toLocaleString('en-IN')} was recorded.`);
        setAmount('');
        setDonorName('');
        setTimeout(() => {
          setSelectedCampaign(null);
          setMessage('');
          fetchCampaigns();
        }, 2200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', margin: 0, padding: 0, backgroundColor: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', boxSizing: 'border-box' }}>
      
      {/* Navigation Bar - Full Width */}
      <nav style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '1.25rem 3rem', width: '100%', boxSizing: 'border-box', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #2563eb, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '1.2rem' }}>D</div>
            <span style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>DonateFlow</span>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '1rem', color: '#475569' }}>
            <span>Total Raised: <strong style={{ color: '#059669' }}>₹{totalRaised.toLocaleString('en-IN')}</strong></span>
            <span>•</span>
            <span>Target Goal: <strong>₹{totalGoal.toLocaleString('en-IN')}</strong></span>
          </div>
        </div>
      </nav>

      {/* Hero Header - Full Width */}
      <header style={{ textAlign: 'center', padding: '4.5rem 2rem 3rem', background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)', width: '100%', boxSizing: 'border-box' }}>
        <span style={{ display: 'inline-block', padding: '0.4rem 1rem', background: '#dbeafe', color: '#1d4ed8', borderRadius: '999px', fontSize: '0.85rem', fontWeight: '700', marginBottom: '1.25rem', letterSpacing: '0.05em' }}>
          TRANSPARENT SOCIAL IMPACT
        </span>
        <h1 style={{ fontSize: '3.2rem', color: '#0f172a', fontWeight: '900', margin: '0 0 1rem', letterSpacing: '-0.03em' }}>
          Empower Change with DonateFlow
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.25rem', maxWidth: '750px', margin: '0 auto', lineHeight: '1.6' }}>
          Discover verified community causes across India and contribute directly with seamless, real-time tracking.
        </p>
      </header>

      {/* Campaign Cards Grid - Full Screen Ratio */}
      <main style={{ width: '100%', padding: '1.5rem 3rem 5rem', boxSizing: 'border-box', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2.5rem' }}>
        {campaigns.map((camp) => {
          const progress = Math.min(100, Math.round((camp.raised_amount / camp.target_amount) * 100)) || 0;
          const bgImg = CAMPAIGN_IMAGES[camp.title] || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800&q=80';
          const tag = CAMPAIGN_TAGS[camp.title] || 'Community';

          return (
            <div key={camp.id} style={{ backgroundColor: '#ffffff', borderRadius: '20px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 10px 20px -4px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s ease' }}>
              
              <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                <img src={bgImg} alt={camp.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', top: '14px', left: '14px', background: 'rgba(15, 23, 42, 0.8)', color: '#fff', backdropFilter: 'blur(6px)', padding: '0.35rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600' }}>
                  {tag}
                </span>
                <span style={{ position: 'absolute', bottom: '14px', right: '14px', background: '#ffffff', color: '#0f172a', padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '800', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                  {progress}% funded
                </span>
              </div>

              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.6rem' }}>{camp.title}</h2>
                  <p style={{ color: '#64748b', fontSize: '0.98rem', lineHeight: '1.6', margin: '0 0 1.5rem', minHeight: '48px' }}>{camp.description}</p>

                  <div style={{ background: '#f1f5f9', borderRadius: '999px', height: '10px', overflow: 'hidden', marginBottom: '1rem' }}>
                    <div style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #2563eb, #38bdf8)', height: '100%', borderRadius: '999px' }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                    <div>
                      <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase' }}>Raised</span>
                      <strong style={{ color: '#0f172a', fontSize: '1.15rem' }}>₹{Number(camp.raised_amount).toLocaleString('en-IN')}</strong>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase' }}>Target Goal</span>
                      <span style={{ color: '#64748b', fontWeight: '700', fontSize: '1.15rem' }}>₹{Number(camp.target_amount).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCampaign(camp)}
                  style={{ width: '100%', padding: '0.9rem', background: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', letterSpacing: '0.01em' }}
                >
                  Contribute Support
                </button>
              </div>
            </div>
          );
        })}
      </main>

      {/* Donation Popup Modal */}
      {selectedCampaign && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 50 }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '2.25rem', maxWidth: '460px', width: '100%', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.35rem' }}>Support Campaign</h3>
            <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0 0 1.5rem' }}>Contributing to: <strong>{selectedCampaign.title}</strong></p>

            {message ? (
              <div style={{ padding: '1.25rem', backgroundColor: '#ecfdf5', color: '#065f46', borderRadius: '14px', textAlign: 'center', fontWeight: '700', fontSize: '1rem', lineHeight: '1.5' }}>
                {message}
              </div>
            ) : (
              <form onSubmit={handleDonate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#475569', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Donor Name</label>
                  <input
                    type="text"
                    placeholder="Jane Doe (or leave blank for Anonymous)"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    style={{ width: '100%', padding: '0.85rem', backgroundColor: '#ffffff', color: '#0f172a', border: '1.5px solid #cbd5e1', borderRadius: '10px', fontSize: '1rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#475569', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Select Amount (₹)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    {['500', '1000', '2500', '5000'].map((preset) => (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => setAmount(preset)}
                        style={{ padding: '0.65rem 0.2rem', background: amount === preset ? '#2563eb' : '#f8fafc', color: amount === preset ? '#ffffff' : '#334155', border: '1.5px solid', borderColor: amount === preset ? '#2563eb' : '#cbd5e1', borderRadius: '10px', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer' }}
                      >
                        ₹{preset}
                      </button>
                    ))}
                  </div>

                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="Enter custom amount in ₹"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{ width: '100%', padding: '0.85rem', backgroundColor: '#ffffff', color: '#0f172a', border: '1.5px solid #cbd5e1', borderRadius: '10px', fontSize: '1rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.85rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedCampaign(null)}
                    style={{ flex: 1, padding: '0.85rem', border: '1.5px solid #cbd5e1', background: '#f1f5f9', color: '#334155', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '1rem' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{ flex: 1, padding: '0.85rem', border: 'none', background: '#2563eb', color: '#ffffff', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '1rem' }}
                  >
                    {loading ? 'Processing...' : 'Confirm ₹'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}