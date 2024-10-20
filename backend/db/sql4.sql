SELECT 
    mw.id AS wine_id,
    mw.name || ' ' || mw.vintage AS wine_name_vintage,
    COUNT(co.id) AS order_count
FROM 
    customer_order co
JOIN 
    master_wine mw 
ON 
    co.wine_product_id = mw.id
WHERE 
    co.status IN ('dispatched', 'paid')  -- Filter for dispatched or paid orders
GROUP BY 
    mw.id, wine_name_vintage  -- Group by wine ID and name + vintage
ORDER BY 
    order_count DESC;  -- Sort by occurrence number (order count) in descending order
