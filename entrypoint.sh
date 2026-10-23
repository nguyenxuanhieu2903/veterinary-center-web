#!/bin/sh
set -e

echo "=========================================================="
echo " Starting Veterinary Center Web Application (TV1 DevOps)  "
echo "=========================================================="

echo "Waiting for MySQL database connection ($DB_HOST:$DB_PORT)..."
python << 'EOF'
import os
import sys
import time
import pymysql

host = os.getenv("DB_HOST", "db")
port = int(os.getenv("DB_PORT", "3306"))
user = os.getenv("MYSQL_USER", "vet_user")
password = os.getenv("MYSQL_PASSWORD", "vet_password123")
db = os.getenv("MYSQL_DATABASE", "vet_center_db")

retries = 35
while retries > 0:
    try:
        conn = pymysql.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            database=db,
            connect_timeout=3
        )
        conn.close()
        print(f"Successfully connected to MySQL at {host}:{port}/{db}!")
        sys.exit(0)
    except Exception as e:
        print(f"Database not ready yet... Waiting. ({e})")
        time.sleep(2)
        retries -= 1

print("ERROR: Unable to connect to MySQL database within timeout!")
sys.exit(1)
EOF

echo "Running migrations..."
python manage.py makemigrations --noinput
python manage.py migrate --noinput

echo "Database ready. Launching application server..."
exec "$@"
