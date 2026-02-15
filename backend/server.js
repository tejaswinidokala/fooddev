// backend/server.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const DATA_DIR = path.join(__dirname, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const MENU_FILE = path.join(DATA_DIR, "menu.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

// --- Ensure data files exist ---
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, "{}");
if (!fs.existsSync(MENU_FILE)) fs.writeFileSync(MENU_FILE, "[]");
if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, "[]");

// --- Helper functions ---
function readJSON(file) {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
}
function writeJSON(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
}

// --- Auth routes ---
app.post("/api/signup", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.json({ success: false, message: "Fill all fields" });

    let users = readJSON(USERS_FILE);
    if (users[username]) return res.json({ success: false, message: "Username exists" });

    users[username] = password;
    writeJSON(USERS_FILE, users);
    res.json({ success: true, message: "Account created" });
});

app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    let users = readJSON(USERS_FILE);

    if (!users[username] || users[username] !== password)
        return res.json({ success: false, message: "Invalid credentials" });

    res.json({ success: true, message: "Login successful" });
});

// --- Menu routes ---
app.get("/api/menu", (req, res) => {
    let menu = readJSON(MENU_FILE);
    res.json(menu);
});

app.post("/api/menu/add", (req, res) => {
    const newItem = req.body; // {name, price, type, serves}
    let menu = readJSON(MENU_FILE);
    menu.push(newItem);
    writeJSON(MENU_FILE, menu);
    res.json({ success: true });
});

app.post("/api/menu/delete", (req, res) => {
    const { index } = req.body;
    let menu = readJSON(MENU_FILE);
    menu.splice(index, 1);
    writeJSON(MENU_FILE, menu);
    res.json({ success: true });
});

// --- Orders ---
app.post("/api/orders", (req, res) => {
    const order = req.body;
    let orders = readJSON(ORDERS_FILE);
    orders.push(order);
    writeJSON(ORDERS_FILE, orders);
    res.json({ success: true });
});

app.get("/api/admin/stats", (req, res) => {
    const orders = readJSON(ORDERS_FILE);

    const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const orderCount = orders.length;

    res.json({
        revenue,
        orders: orderCount
    });
});


// --- Serve frontend static files (optional) ---
app.use("/", express.static(path.join(__dirname, "../frontend")));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));