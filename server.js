const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./variant_5.db', (err) => {

    if (err) {
        console.log(err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

// =====================================
// GET - отримати всі піци
// =====================================
app.get('/pizzas', (req, res) => {

    const sql = 'SELECT * FROM pizzas';

    db.all(sql, [], (err, rows) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(rows);
    });
});

// =====================================
// GET - отримати клієнтів
// =====================================
app.get('/clients', (req, res) => {

    const sql = 'SELECT * FROM clients';

    db.all(sql, [], (err, rows) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(rows);
    });
});

// =====================================
// GET - отримати замовлення
// =====================================
app.get('/orders', (req, res) => {

    const sql = `
        SELECT
        orders.id,
        clients.full_name AS client,
        pizzas.pizza_name,
        couriers.full_name AS courier,
        orders.status,
        orders.amount
        FROM orders
        INNER JOIN clients ON orders.client_id = clients.id
        INNER JOIN pizzas ON orders.pizza_id = pizzas.id
        INNER JOIN couriers ON orders.courier_id = couriers.id
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(rows);
    });
});

// =====================================
// GET - отримати кур'єрів
// =====================================
app.get('/couriers', (req, res) => {

    const sql = 'SELECT * FROM couriers';

    db.all(sql, [], (err, rows) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(rows);
    });
});

// =====================================
// GET - отримати інгредієнти
// =====================================
app.get('/ingredients', (req, res) => {

    const sql = 'SELECT * FROM ingredients';

    db.all(sql, [], (err, rows) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(rows);
    });
});

// =====================================
// POST - додати клієнта
// =====================================
app.post('/clients', (req, res) => {

    const {
        full_name,
        phone,
        address,
        delivery_zone,
        registration_date,
        assigned_courier_id
    } = req.body;

    const sql = `
        INSERT INTO clients
        (
            full_name,
            phone,
            address,
            delivery_zone,
            registration_date,
            assigned_courier_id
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            full_name,
            phone,
            address,
            delivery_zone,
            registration_date,
            assigned_courier_id
        ],

        function (err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: 'Client added successfully',
                id: this.lastID
            });
        }
    );
});

// =====================================
// PUT - оновити статус замовлення
// =====================================
app.put('/orders/:id', (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    const sql = `
        UPDATE orders
        SET status = ?
        WHERE id = ?
    `;

    db.run(sql, [status, id], function (err) {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json({
            message: 'Order updated successfully'
        });
    });
});

// =====================================
// DELETE - видалити піцу
// =====================================
app.delete('/pizzas/:id', (req, res) => {

    const { id } = req.params;

    const sql = 'DELETE FROM pizzas WHERE id = ?';

    db.run(sql, [id], function (err) {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json({
            message: 'Pizza deleted successfully'
        });
    });
});

// =====================================
// GET - статистика
// =====================================
app.get('/statistics', (req, res) => {

    const sql = `
        SELECT
        COUNT(*) AS total_orders,
        AVG(amount) AS average_amount,
        MAX(amount) AS max_amount,
        MIN(amount) AS min_amount
        FROM orders
    `;

    db.get(sql, [], (err, row) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(row);
    });
});

// =====================================
// 404 помилка
// =====================================
app.use((req, res) => {

    res.status(404).json({
        error: 'Route not found'
    });
});

// =====================================
// запуск сервера
// =====================================
app.listen(PORT, () => {

    console.log(`Server started on port ${PORT}`);
}); 
