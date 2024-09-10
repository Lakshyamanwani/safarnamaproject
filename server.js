const express = require('express');
const path = require('path');
const Razorpay = require('razorpay');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: 'rzp_live_wvVpmGQJPMc6KL', // Replace with your Razorpay key_id
    key_secret: 'O25R7fG6JuUsolG43qNGXF2p' // Replace with your Razorpay key_secret
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Create an order route
app.post('/create-order', (req, res) => {
    const { amount, name, email, contact } = req.body;

    // Generate a dynamic receipt_id
    const receipt_id = `receipt_order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Create an order with Razorpay
    const options = {
        amount: amount, // Amount in smallest currency unit, e.g., paise for INR
        currency: "INR",
        receipt: receipt_id, // Use the dynamically generated receipt_id
        payment_capture: 1 // Auto capture after payment
    };

    razorpay.orders.create(options, (err, order) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // Send the order details back to the client
        res.json({
            key: 'rzp_live_wvVpmGQJPMc6KL', // Replace with your Razorpay key_id
            amount: order.amount,
            order_id: order.id,
            receipt_id: order.receipt // Return the receipt_id as well for reference
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
