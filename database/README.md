# Pizza Ordering App - Database Layer

This folder contains the MySQL database setup for the Pizza Ordering application using Docker.

## Overview

- **Database**: MySQL 8.0
- **Container Manager**: Docker Compose
- **Initialization**: Automatic via SQL script
- **Data Persistence**: Docker volume

## Folder Structure

```
database/
├── docker-compose.yml    # Docker Compose configuration
├── init.sql             # Database initialization script
├── .env                 # Environment variables (credentials)
├── .env.example         # Example environment file
├── .gitignore          # Git ignore patterns
└── README.md           # This file
```

## Database Schema

### Users Table

Stores user registration and authentication information.

| Column     | Type          | Constraints                    | Description                          |
|------------|---------------|--------------------------------|--------------------------------------|
| id         | INT           | PRIMARY KEY, AUTO_INCREMENT    | Unique user identifier               |
| name       | VARCHAR(255)  | NOT NULL                       | User's full name                     |
| email      | VARCHAR(255)  | NOT NULL, UNIQUE               | User's email (used for login)        |
| password   | VARCHAR(255)  | NOT NULL                       | Hashed password                      |
| created_at | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP      | Account creation timestamp           |
| updated_at | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP      | Last update timestamp                |

**Indexes:**
- Primary key on `id`
- Unique index on `email`
- Index on `email` for faster lookups
- Index on `created_at` for sorting

## Prerequisites

- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))
- Docker Compose installed (comes with Docker Desktop)

## Setup Instructions

### 1. Start the Database

Navigate to the database folder and start the container:

```bash
cd database
docker-compose up -d
```

The `-d` flag runs the container in detached mode (background).

### 2. Verify Container is Running

```bash
docker-compose ps
```

You should see:
```
NAME               IMAGE       STATUS        PORTS
pizza_app_mysql    mysql:8.0   Up X minutes  0.0.0.0:3306->3306/tcp
```

### 3. Check Container Health

```bash
docker-compose ps
```

Wait until the health status shows "healthy".

### 4. View Container Logs

```bash
docker-compose logs -f mysql
```

Press `Ctrl+C` to stop following logs.

## Database Connection Information

### From Host Machine (Outside Docker)

```
Host: localhost
Port: 3306
Database: pizza_app_db
User: pizza_user
Password: pizza_password123
```

### From Docker Network (Backend in Docker)

```
Host: mysql
Port: 3306
Database: pizza_app_db
User: pizza_user
Password: pizza_password123
```

### Root Access

```
Host: localhost
Port: 3306
User: root
Password: rootpassword123
```

## Common Operations

### Connect to MySQL CLI

Using the application user:
```bash
docker-compose exec mysql mysql -u pizza_user -p pizza_app_db
```

Using root:
```bash
docker-compose exec mysql mysql -u root -p
```

Enter the password when prompted.

### Stop the Database

```bash
docker-compose stop
```

### Start the Database

```bash
docker-compose start
```

### Restart the Database

```bash
docker-compose restart
```

### Stop and Remove Container

```bash
docker-compose down
```

**Note**: This removes the container but keeps the data volume.

### Stop and Remove Everything (Including Data)

```bash
docker-compose down -v
```

**⚠️ Warning**: This deletes all data permanently!

### View Database Logs

```bash
docker-compose logs mysql
```

Follow logs in real-time:
```bash
docker-compose logs -f mysql
```

## Initialization Process

When the MySQL container starts for the first time:

1. Docker Compose reads environment variables from `.env`
2. MySQL creates the database specified in `MYSQL_DATABASE`
3. MySQL creates the user specified in `MYSQL_USER` with `MYSQL_PASSWORD`
4. MySQL executes all `.sql` files in `/docker-entrypoint-initdb.d/`
5. Our `init.sql` script creates the `users` table with proper schema

## Verification

### Check if Database Exists

```bash
docker-compose exec mysql mysql -u pizza_user -p -e "SHOW DATABASES;"
```

### Check if Table Exists

```bash
docker-compose exec mysql mysql -u pizza_user -p pizza_app_db -e "SHOW TABLES;"
```

### View Table Structure

```bash
docker-compose exec mysql mysql -u pizza_user -p pizza_app_db -e "DESCRIBE users;"
```

### Query Sample Data

```bash
docker-compose exec mysql mysql -u pizza_user -p pizza_app_db -e "SELECT * FROM users;"
```

## Environment Variables

Environment variables are stored in `.env` file:

- `MYSQL_ROOT_PASSWORD`: Root password for MySQL
- `MYSQL_DATABASE`: Database name to create
- `MYSQL_USER`: Application user name
- `MYSQL_PASSWORD`: Application user password

**Security Note**: Never commit `.env` to version control. Use `.env.example` as a template.

## Data Persistence

Database data is stored in a Docker volume named `mysql_data`. This ensures:
- Data survives container restarts
- Data survives container removal (unless using `docker-compose down -v`)
- Data can be backed up and restored

### Backup Data

```bash
docker-compose exec mysql mysqldump -u root -p pizza_app_db > backup.sql
```

### Restore Data

```bash
docker-compose exec -T mysql mysql -u root -p pizza_app_db < backup.sql
```

## Backend Integration (Next Steps)

To connect the backend to this database:

### 1. Install MySQL Driver

```bash
cd ../backend
npm install mysql2
```

### 2. Create Database Connection

```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'pizza_user',
  password: 'pizza_password123',
  database: 'pizza_app_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
```

### 3. Example Queries

```javascript
// Insert user
const [result] = await pool.execute(
  'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
  [name, email, hashedPassword]
);

// Find user by email
const [rows] = await pool.execute(
  'SELECT * FROM users WHERE email = ?',
  [email]
);
```

## Troubleshooting

### Container Won't Start

Check if port 3306 is already in use:
```bash
lsof -i :3306
```

Kill the process using port 3306:
```bash
kill -9 <PID>
```

### Can't Connect to Database

1. Ensure container is running: `docker-compose ps`
2. Check container logs: `docker-compose logs mysql`
3. Verify credentials in `.env`
4. Test connection from inside container:
   ```bash
   docker-compose exec mysql mysql -u pizza_user -p
   ```

### Initialization Script Didn't Run

The init script only runs on first startup. To force re-initialization:

```bash
docker-compose down -v
docker-compose up -d
```

### Permission Denied Errors

Ensure init.sql has proper permissions:
```bash
chmod 644 init.sql
```

## Security Recommendations

For production deployment:

1. **Change Default Passwords**: Use strong, unique passwords
2. **Use Environment Variables**: Never hardcode credentials
3. **Restrict Network Access**: Limit database access to backend only
4. **Enable SSL/TLS**: Encrypt database connections
5. **Regular Backups**: Implement automated backup strategy
6. **Update MySQL**: Keep MySQL image up to date
7. **Monitor Logs**: Set up log aggregation and monitoring
8. **Least Privilege**: Use database users with minimal required permissions

## Future Enhancements (TODO)

- [ ] Add additional tables (orders, pizzas, cart, etc.)
- [ ] Set up database migrations framework
- [ ] Add database seeding for development
- [ ] Configure replication for high availability
- [ ] Set up automated backups
- [ ] Add monitoring and alerting
- [ ] Implement database connection pooling in backend
- [ ] Add database indexes optimization
- [ ] Set up read replicas for scaling

## Tech Stack

- **MySQL**: 8.0
- **Docker**: Container runtime
- **Docker Compose**: Multi-container orchestration

## Notes

- Database runs on port 3306 (default MySQL port)
- Data persists in Docker volume `mysql_data`
- Initialization happens only on first container creation
- Container auto-restarts on failure
- Health checks ensure database is ready before accepting connections
