SELECT 
    mw.name || ' ' || mw.vintage AS wine_name_vintage,
    SUM(co.quantity) AS total_quantity
FROM 
    customer_order co
JOIN 
    master_wine mw 
ON 
    co.wine_product_id = mw.id
WHERE 
    co.status IN ('dispatched', 'paid')  -- Filter for dispatched or paid orders
GROUP BY 
    wine_name_vintage
ORDER BY 
    total_quantity DESC;  -- Sort by total quantity in descending order