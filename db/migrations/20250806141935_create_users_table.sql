-- migrate:up
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TYPE user_role as ENUM ('admin','sales','support');
CREATE TYPE cstatus as ENUM ('lead','prospect','customer');
CREATE TYPE ostatus as ENUM ('pending','processing','shipped','delivered','cancelled');
CREATE TYPE channelType as ENUM ('email','whatsapp','instagram','call');
CREATE TABLE Users(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role user_role DEFAULT 'sales',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE Customers(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone_no TEXT NOT NULL,
    customer_status cstatus DEFAULT 'lead',
    handled_by UUID REFERENCES Users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Orders(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES Customers(id) ON DELETE CASCADE,
    order_status ostatus DEFAULT 'pending',
    product TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Communications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES Customers(id) ON DELETE CASCADE,
    order_id UUID REFERENCES Orders(id) ON DELETE CASCADE,
    channel channelType NOT NULL,
    message TEXT NOT NULL,
    sent_by UUID REFERENCES Users(id),
    date date DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- migrate:down
DROP TABLE IF EXISTS Communications, Orders, Customers, Users CASCADE;
DROP TYPE IF EXISTS channelType;
DROP TYPE IF EXISTS ostatus;
DROP TYPE IF EXISTS cstatus;
DROP TYPE IF EXISTS user_role;