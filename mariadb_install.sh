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
# sudo mysql
# sudo mysql --execute="ALTER USER 'root'@'localhost' IDENTIFIED BY 'root'; FLUSH PRIVILEGES; CREATE DATABASE csye6225_MK;"

#----

sudo apt remove git -y
sudo groupadd csye6225
sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225
mkdir /opt/csye6225/madhura_kurhadkar_002769373_06
sudo unzip madhura_kurhadkar_002769373_06 -d /opt/csye6225/madhura_kurhadkar_002769373_06_app/
# sudo chmod 655 "/opt/csye6225/madhura_kurhadkar_002769373_06_app"
(cd /opt/csye6225/madhura_kurhadkar_002769373_06_app && sudo npm install)
# Move systemd service unit file to the correct location
sudo mv /opt/csye6225/madhura_kurhadkar_002769373_06_app/webapp.service /etc/systemd/system/
# Enable and start the systemd service
sudo systemctl enable webapp
sudo systemctl start webapp
sudo apt-get clean

#----
# sudo mkdir -p ~/madhura_kurhadkar_002769373_06
# sudo chmod 755 ~/madhura_kurhadkar_002769373_06

# sudo unzip madhura_kurhadkar_002769373_06 -d ~/madhura_kurhadkar_002769373_06_app

# cd ~/madhura_kurhadkar_002769373_06_app || exit

# # Install project dependencies (if package.json exists)
# if [ -f "package.json" ]; then
#     echo "Installing project dependencies..."
#     sudo npm install
#     echo "Project dependencies have been installed."
# fi

# # # Run your Node.js file
# # echo "Run your Node.js file..."
# # node server.js
# sudo apt-get clean

