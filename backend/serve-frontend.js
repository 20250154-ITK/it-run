const express = require('express');
const path = require('path');
const app = express();

const distPath = '/home/ubuntu/itrun-platform/frontend/dist';

app.use(express.static(distPath));

app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Frontend serving on port 3000');
});
