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

# mkdir /opt/madhura_kurhadkar_002769373_05

sudo mkdir -p /opt/madhura_kurhadkar_002769373_05
sudo chmod 777 /opt/madhura_kurhadkar_002769373_05

sudo unzip "/opt/madhura_kurhadkar_002769373_05.zip" -d "/opt/madhura_kurhadkar_002769373_05"

cd /opt/madhura_kurhadkar_002769373_05 || exit

# Install project dependencies (if package.json exists)
if [ -f "package.json" ]; then
    echo "Installing project dependencies..."
    sudo npm install
    echo "Project dependencies have been installed."
fi

# Run your Node.js file
echo "Running your Node.js file..."
node server.js
sudo apt-get clean