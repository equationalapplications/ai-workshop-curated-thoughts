require('dotenv').config();
const express = require('express');
const paymentRoutes = require('./controllers/payment');

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.post('/api/create-checkout-session', paymentRoutes.createCheckoutSession);

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
