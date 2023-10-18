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

sudo unzip "/opt/madhura_kurhadkar_002769373_05.zip" -d "."

sudo apt-get clean