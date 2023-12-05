# Welcome to Web Application Development!

This repository is your go-to for building a web application. We've got guidelines for creating RESTful APIs, handling databases, building custom AMIs, and setting up continuous integration using GitHub Actions.

## Crafting RESTful APIs

- Always use JSON for requests and responses.
- No need for a user interface—this is all about APIs.
- Expect proper HTTP status codes for all API calls.
- We're big on top-notch code quality, so make sure to use unit and integration tests!

## Setting up the Database

- The application takes care of the database setup at startup.
- It handles everything from setting up tables to defining schemas and more.
- Consider using ORM frameworks like Hibernate, SQLAlchemy, or Sequelize for smoother development.

## Managing User Accounts

- Load account details from a specific CSV file.
- The app creates user accounts based on this file during startup.
- It only creates new accounts if they don't exist yet—no unnecessary updates.
- We hash passwords using BCrypt for security. And remember, certain date-related info in the CSV is ignored!

## Web App Essentials

- Our EC2 instance's database is from the RDS instance launched by Pulumi.
- Skip using any local databases on the EC2 instance.

## Crafting AMIs with Packer

- We're building custom AMIs using Packer, starting with Debian 12.
- These AMIs are private and only for your deployment.
- All builds happen in your DEV AWS account and are shared with the DEMO account.
- Everything needed to run your app, including databases like MySQL/MariaDB/PostgreSQL, is installed locally in the AMI.
- Keep your Packer template in this repo—it's where the magic happens!

## Packer + GitHub Actions

### Check the Workflow

- When you create a pull request:
  - Check if `packer fmt` tweaks your template. If so, no merging!
  - Also, we validate your template using `packer validate`. If it doesn’t pass, no merging again!

### Building AMIs Workflow

- For this, set up a special IAM user in your DEV AWS account.
- When your pull request is merged:
  - Run your integration tests—they’re super important!
  - We’ll build your app artifact on GitHub Actions, not in the AMI.
  - Then, we'll craft the AMI, including dependencies and configs.
  - And finally, share the new AMI with your DEMO account.
  
To ensure that your service starts up after cloud-init has completed execution, you can have your service be required/wanted by cloud-init instead of the usual multi-user.

Avoid starting the application until cloud-init has completed execution, at which point, your userdata script would have executed.



