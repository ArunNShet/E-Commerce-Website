# MVP Plan (Step 2)

This document defines the minimum feature set to ship a usable v1.

## Scope

### 1) Authentication

Backend:
- `POST /api/auth/register`
- `POST /api/auth/login`
- Roles: `USER`, `ADMIN`

Frontend:
- Pages: Login, Register
- Persist auth state (token/session)

### 2) Product Catalog

Backend:
- `GET /api/products`
- `GET /api/products/{id}`
- `POST /api/products` (admin)
- `PUT /api/products/{id}` (admin)
- `DELETE /api/products/{id}` (admin)

Frontend:
- Product list page
- Product detail page
- Admin product form

### 3) Cart

Backend:
- `GET /api/cart`
- `POST /api/cart/items`
- `PUT /api/cart/items/{itemId}`
- `DELETE /api/cart/items/{itemId}`

Frontend:
- Cart page
- Quantity update and remove actions

### 4) Checkout + Orders

Backend:
- `POST /api/orders` (create order from cart)
- `GET /api/orders` (current user history)
- `GET /api/orders/{id}`
- Order states: `CREATED`, `PAID`, `CANCELLED`

Frontend:
- Checkout page
- Order confirmation page
- Order history page

## Data Model (MVP)

- `User(id, name, email, passwordHash, role, createdAt)`
- `Product(id, name, description, price, stock, status)`
- `Cart(id, userId)`
- `CartItem(id, cartId, productId, quantity, unitPrice)`
- `Order(id, userId, totalAmount, status, createdAt)`
- `OrderItem(id, orderId, productId, quantity, unitPrice)`

## Delivery Order

1. Auth foundation (register/login + role checks)
2. Product APIs + frontend product list/detail
3. Cart APIs + frontend cart UI
4. Order placement + order history
5. Basic integration tests for end-to-end happy path

## Definition of Done (MVP)

- User can register and login
- User can browse products and add to cart
- User can place an order from cart
- User can view order history
- Admin can manage products
- All APIs return consistent error payloads
