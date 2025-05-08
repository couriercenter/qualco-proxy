const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

app.post('/track', async (req, res) => {
  const voucher = req.body.voucher;

  if (!voucher) {
    return res.status(400).json({ error: 'Missing voucher' });
  }

  try {
    const response = await fetch('https://shipm.cc.qualco.eu/ccservice/api/Tracking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Context: {
          UserAlias: "CourierCenterAPITestUser",
          CredentialValue: "CourierCenterAPITestUser",
          ApiKey: "CourierCenterAPITestKey"
        },
        Identifier: voucher,
        ReturnShipmentInfo: "TRUE",
        ReturnPodInfo: "TRUE",
        ReturnTrackingInfo: "TRUE"
      })
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Qualco API returned status ${response.status}` });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Σωστό για Render – ΧΩΡΙΣ fallback
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Proxy API listening on port ${PORT}`));
