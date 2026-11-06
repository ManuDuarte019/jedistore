DROP DATABASE IF EXISTS `storejedi`;
CREATE DATABASE storejedi
DEFAULT CHARACTER SET utf8mb4
DEFAULT COLLATE utf8mb4_unicode_ci;
USE storejedi;

-- =====================================================
-- USER TYPES
-- =====================================================

CREATE TABLE user_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- =====================================================
-- USERS
-- =====================================================

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    phone VARCHAR(20),
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_users_types
        FOREIGN KEY (type_id)
        REFERENCES user_types(id)
);

-- =====================================================
-- ADDRESSES
-- =====================================================

CREATE TABLE addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    zipcode VARCHAR(10) NOT NULL,

    CONSTRAINT fk_addresses_users
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- =====================================================
-- CATEGORIES
-- =====================================================

CREATE TABLE products_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE
);
-- =====================================================
-- FAQS CATEGORIES
-- =====================================================

CREATE TABLE faqs_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    active TINYINT(1) DEFAULT 1
);

-- =====================================================
-- FAQS
-- =====================================================

CREATE TABLE faqs (
    id INT AUTO_INCREMENT PRIMARY KEY,

    faqs_category_id INT NOT NULL,

    question VARCHAR(255) NOT NULL,
    answer TEXT NOT NULL,

    active TINYINT(1) DEFAULT 1,

    CONSTRAINT fk_faqs_categories
        FOREIGN KEY (faqs_category_id)
        REFERENCES faqs_categories(id)
);
-- =====================================================
-- PRODUCTS
-- =====================================================

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,

    category_id INT NOT NULL,

    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    price DECIMAL(10,2) NOT NULL,

    image VARCHAR(255),

    description TEXT,

    stock INT DEFAULT 0,

    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_products_categories
        FOREIGN KEY (category_id)
        REFERENCES products_categories(id)
);

-- =====================================================
-- SUBSCRIPTIONS
-- =====================================================

CREATE TABLE subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    plan_name VARCHAR(100) NOT NULL,

    monthly_price DECIMAL(10,2) NOT NULL,
    start_date DATE NOT NULL,

    status ENUM(
        'ACTIVE',
        'CANCELLED',
        'EXPIRED'
    ) DEFAULT 'ACTIVE',


    CONSTRAINT fk_subscriptions_users
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- =====================================================
-- FAVORITES
-- =====================================================

CREATE TABLE favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,
    product_id INT NOT NULL,

    CONSTRAINT fk_favorites_users
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_favorites_products
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
);

-- =====================================================
-- ORDER STATUS
-- =====================================================

CREATE TABLE order_statuses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- =====================================================
-- ORDERS
-- =====================================================

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,
    address_id INT NOT NULL,

    current_status_id INT NOT NULL,

    subtotal DECIMAL(10,2) NOT NULL,
	grand_total DECIMAL(10,2) NOT NULL,

    shipping_total DECIMAL(10,2) DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_orders_users
        FOREIGN KEY (user_id)
        REFERENCES users(id),

    CONSTRAINT fk_orders_addresses
        FOREIGN KEY (address_id)
        REFERENCES addresses(id),

    CONSTRAINT fk_orders_statuses
        FOREIGN KEY (current_status_id)
        REFERENCES order_statuses(id)
);

-- =====================================================
-- ORDER ITEMS
-- =====================================================

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,

    order_id INT NOT NULL,
    product_id INT NOT NULL,

    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,

    CONSTRAINT fk_order_items_orders
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_order_items_products
        FOREIGN KEY (product_id)
        REFERENCES products(id)
);

-- =====================================================
-- PAYMENTS
-- =====================================================

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,

    order_id INT NOT NULL,

    method ENUM(
        'PIX',
        'BOLETO',
        'CREDIT_CARD',
        'DEBIT_CARD'
    ) NOT NULL,

    amount DECIMAL(10,2) NOT NULL,

    status ENUM(
        'PENDING',
        'APPROVED',
        'DECLINED'
    ) DEFAULT 'PENDING',


    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payments_orders
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
);