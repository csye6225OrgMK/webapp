#!/bin/bash


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

# mkdir /tmp/madhura_kurhadkar_002769373_05

sudo chmod -R 755 /tmp
sudo mkdir -p /tmp/madhura_kurhadkar_002769373_05
sudo chmod 777 /tmp/madhura_kurhadkar_002769373_05

sudo unzip "/tmp/madhura_kurhadkar_002769373_05.zip" -d "/tmp/madhura_kurhadkar_002769373_05"

cd /tmp/madhura_kurhadkar_002769373_05 || exit


# Install project dependencies (if package.json exists)
if [ -f "package.json" ]; then
    echo "Installing project dependencies..."
    sudo npm install
    echo "Project dependencies have been installed."
fi

# # Run your Node.js file
echo "Run your Node.js file..."
# node server.js
sudo apt-get clean