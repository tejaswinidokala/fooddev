const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

/* ------------------ FAKE DATABASE ------------------ */

let menuItems = [
    { id: 1, name: "Paneer Tikka", price: 210, type: "veg" },
    { id: 2, name: "Veg Biryani", price: 190, type: "veg" },
    { id: 3, name: "Chicken Biryani", price: 249, type: "non-veg" },
    { id: 4, name: "Butter Chicken", price: 320, type: "non-veg" }
];

let orders = [];

/* ------------------ ROUTES ------------------ */

// Test
app.get("/", (req, res) => {
    res.send("Food Delivery Backend Running 🚀");
});

// Get Menu
app.get("/api/menu", (req, res) => {
    res.json(menuItems);
});

// Add new menu item (ADMIN)
app.post("/api/menu", (req, res) => {
    const item = { id: Date.now(), ...req.body };
    menuItems.push(item);
    res.json({ message: "Item added", item });
});

// Place Order
app.post("/api/order", (req, res) => {
    const order = {
        id: Date.now(),
        items: req.body.items,
        total: req.body.total
    };
    orders.push(order);
    res.json({ message: "Order placed successfully", order });
});

// Admin stats
app.get("/api/admin/stats", (req, res) => {
    const revenue = orders.reduce((sum, o) => sum + o.total, 0);
    res.json({
        totalOrders: orders.length,
        totalRevenue: revenue
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
