#!/bin/bash
# Update the package list to get the latest package information
sudo apt-get update

sudo apt-get upgrade -y

# Install Node.js and npm
sudo apt-get install -y nodejs npm

# Install MariaDB
# sudo apt-get install -y mariadb-server

# Install unzip
sudo apt-get install -y unzip

sudo apt-get clean
sudo apt remove git -y
sudo groupadd csye6225
sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225
sudo mkdir /opt/csye6225/madhura_kurhadkar_002769373_06
sudo unzip madhura_kurhadkar_002769373_06 -d /opt/csye6225/madhura_kurhadkar_002769373_06/
# sudo chmod 655 "/opt/madhura_kurhadkar_002769373_06"
cd /opt/csye6225/madhura_kurhadkar_002769373_06 || exit
sudo npm install
echo "Project dependencies have been installed."

sudo chown -R csye6225:csye6225 .
sudo chmod -R 755 .

# Move systemd service unit file to the correct location
sudo mv /opt/csye6225/madhura_kurhadkar_002769373_06/webapp.service /etc/systemd/system/
# Enable and start the systemd service
sudo systemctl enable webapp
sudo systemctl start webapp
sudo apt-get clean
