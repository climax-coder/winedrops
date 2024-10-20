const Fastify = require('fastify');
const sqlite3 = require('sqlite3').verbose();
const cors = require('@fastify/cors');

const fastify = Fastify({ logger: true });

// Enable CORS for cross-origin requests
fastify.register(cors, { 
  origin: '*', // Allows all origins. You can customize this based on your need.
});



// Connect to SQLite database
const db = new sqlite3.Database('./db/winedrops.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the database.');
  }
});

// Define a route to fetch all data
fastify.get('/AllData', (request, reply) => {
  const query = `SELECT 
  mw.name || ' ' || mw.vintage AS wine_name_vintage,
  SUM(co.quantity) AS total_quantity,
  SUM(co.total_amount) AS total_amount
FROM 
  customer_order co
JOIN 
  master_wine mw 
ON 
  co.wine_product_id = mw.id
GROUP BY 
  wine_name_vintage; `
  db.all(query, [], (err, rows) => {
    if (err) {
      reply.status(400).send({ error: err.message });
      return;
    }
    reply.send({ data: rows });
  });
});



// Define a route to fetch by revenue
fastify.get('/byRevenue', (request, reply) => {
  const query = `
        SELECT 
    mw.name || ' ' || mw.vintage AS wine_name_vintage,
    SUM(co.quantity) AS total_quantity,
    SUM(co.total_amount) AS total_amount
FROM 
    customer_order co
JOIN 
    master_wine mw 
ON 
    co.wine_product_id = mw.id
WHERE 
    co.status IN ('dispatched', 'paid')  
GROUP BY 
    wine_name_vintage
ORDER BY 
    total_amount DESC;

    `; 
  db.all(query, [], (err, rows) => {
    if (err) {
      reply.status(400).send({ error: err.message });
      return;
    }
    reply.send({ data: rows });
  });
});


// Define a route to fetch by revenue
fastify.get('/byBottles', (request, reply) => {
  const query = `
   SELECT 
    mw.id AS wine_id,
    mw.name || ' ' || mw.vintage AS wine_name_vintage,
    COUNT(co.id) AS order_count,  
    SUM(co.quantity) AS total_quantity,
    SUM(co.total_amount) AS total_amount
FROM 
    customer_order co
JOIN 
    master_wine mw 
ON 
    co.wine_product_id = mw.id
WHERE 
    co.status IN ('dispatched', 'paid') 
GROUP BY 
    mw.id, wine_name_vintage  
ORDER BY 
    total_quantity DESC;  
 `; 
  db.all(query, [], (err, rows) => {
    if (err) {
      reply.status(400).send({ error: err.message });
      return;
    }
    reply.send({ data: rows });
  });
});



// Define a route to fetch by orders
fastify.get('/byOrders', (request, reply) => {
  const query = `
     SELECT 
    mw.id AS wine_id,
    mw.name || ' ' || mw.vintage AS wine_name_vintage,
    COUNT(co.id) AS order_count, 
    SUM(co.quantity) AS total_quantity,
    SUM(co.total_amount) AS total_amount
FROM 
    customer_order co
JOIN 
    master_wine mw 
ON 
    co.wine_product_id = mw.id
WHERE 
    co.status IN ('dispatched', 'paid')  
GROUP BY 
    mw.id, wine_name_vintage 
ORDER BY 
    order_count DESC;  
;

    `; 
  db.all(query, [], (err, rows) => {
    if (err) {
      reply.status(400).send({ error: err.message });
      return;
    }
    reply.send({ data: rows });
  });
});



// Start the Fastify server
const start = async () => {
  try {
    await fastify.listen({ port: 5001 });
    console.log('Server is running on port 5001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
