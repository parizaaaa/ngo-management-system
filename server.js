const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// Put your exact URL and Key directly here:
const SUPABASE_URL = 'https://yxlxgtftodmmnxiurvex.supabase.co';
const SUPABASE_KEY = 'sb_publishable_r-8D-5lqMz1kpkYBwbom_Q_gTmL10qZ';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Route 1: Health check
app.get('/', (req, res) => {
  res.send('NGO Backend Server is live!');
});

// Route 2: Get all campaigns
app.get('/api/campaigns', async (req, res) => {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

// Route 3: Record a donation
app.post('/api/donations', async (req, res) => {
  const { campaign_id, amount, user_id } = req.body;

  if (!campaign_id || !amount) {
    return res.status(400).json({ error: 'Campaign ID and amount are required.' });
  }

  const { data, error } = await supabase
    .from('donations')
    .insert([{ campaign_id, amount, user_id: user_id || null, status: 'success' }])
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ message: 'Donation recorded successfully!', donation: data[0] });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});