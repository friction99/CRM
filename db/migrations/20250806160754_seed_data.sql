-- migrate:up

WITH INSERTED_USERS AS (
    INSERT INTO USERS (name,email,password,role) VALUES 
    ('Alice Admin', 'alice@crm.com', 'hashedpass1', 'admin'),
    ('Bob Sales', 'bob@crm.com', 'hashedpass2', 'sales'),
    ('Charlie Support', 'charlie@crm.com', 'hashedpass3', 'support')
    RETURNING name,id,email
),
INSERTED_CUSTOMERS AS(
    INSERT INTO Customers (name,email,phone_no,customer_status,handled_by)
    SELECT 
        t.name,
        t.email,
        t.phone_no,
        t.customer_status,
        u.id
    FROM (
        SELECT 'John Doe' as name,'john@example.com' as email,'9999999999' as phone_no,'lead'::cstatus as customer_status,'Bob Sales' as assignee
        UNION ALL
        SELECT 'Jane Smith','jane@example.com','8888888888','prospect','Charlie Support'
    ) t 
    JOIN INSERTED_USERS u on u.name = t.assignee
    RETURNING id,email,handled_by
)
,INSERTED_ORDERS AS (
    INSERT INTO ORDERS (customer_id,order_status,product,price) 
    SELECT 
        (SELECT id from INSERTED_CUSTOMERS WHERE email = 'john@example.com'),
        unnest(ARRAY['pending','processing','shipped','delivered','cancelled']::ostatus[]),
        unnest(ARRAY['laptop','Mouse','Touchpad','Multi-plug','notebook']),
        unnest(ARRAY[100000,5000,1000,500,100]::DECIMAL[])   
    RETURNING id,customer_id
)
INSERT INTO Communications (customer_id,order_id,channel,message,sent_by)
SELECT 
    c.id,
    o.id,
    t.channel,
    t.message,
    u.id
FROM (
    SELECT 'whatsapp'::channelType AS channel,
           'Buy at 10% discount ...' AS message,
           'bob@crm.com' AS mail
    UNION ALL
    SELECT 'email'::channelType AS channel,
           'Buy at 20% discount ...' AS message,
           'charlie@crm.com' AS mail
) t
JOIN inserted_users u ON u.email = t.mail
JOIN inserted_customers c ON c.handled_by = u.id
JOIN inserted_orders o ON o.customer_id = c.id;
-- migrate:down
TRUNCATE TABLE Communications, Orders, Customers, Users CASCADE;

