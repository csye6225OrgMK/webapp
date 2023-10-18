#!/bin/bash

DB_NAME="csye6225_MK"
DB_USERNAME="root"
DB_PASSWORD=""
DB_HOST="127.0.0.1"
PORT=8080

# Update the package list to get the latest package information
sudo apt-get update

sudo apt-get upgrade -y

# Install Node.js and npm
sudo apt-get install -y nodejs npm

# Install MariaDB
sudo apt-get install -y mariadb-server

# Install unzip
sudo apt-get install -y unzip

# Start and enable MariaDB service
sudo systemctl start mariadb
sudo systemctl enable mariadb

# Set the root password for MariaDB
# sudo mysqladmin -u root password "$ROOT_PASSWORD"
sudo mysql
sudo mysql --execute="ALTER USER 'root'@'localhost' IDENTIFIED BY 'root'; FLUSH PRIVILEGES; CREATE DATABASE csye6225_MK;"

# mkdir /opt/madhura_kurhadkar_002769373_05

# sudo chmod -R 755 /tmp
sudo mkdir -p /madhura_kurhadkar_002769373_05
sudo chmod 755 /madhura_kurhadkar_002769373_05

sudo unzip madhura_kurhadkar_002769373_05 -d madhura_kurhadkar_002769373_05_app

cd /madhura_kurhadkar_002769373_05 || exit

echo "Hello, starting with project installation at $DEST_DIR"

# Create a .env file in the destination directory
cat <<EOL > "madhura_kurhadkar_002769373_05/.env"
DB_NAME='$DB_NAME'
DB_USERNAME='$DB_USERNAME'
DB_PASSWORD='$DB_PASSWORD'
DB_HOST='$DB_HOST'
PORT=$PORT
EOL

echo ".env file has been created at: madhura_kurhadkar_002769373_05/.env"
cat "madhura_kurhadkar_002769373_05/.env"


# Install project dependencies (if package.json exists)
if [ -f "package.json" ]; then
    echo "Installing project dependencies..."
    sudo npm install
    echo "Project dependencies have been installed."
fi

# # Run your Node.js file
# echo "Run your Node.js file..."
# node server.js
# sudo apt-get clean

