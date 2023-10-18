packer {
  required_plugins {
    amazon = {
      source  = "github.com/hashicorp/amazon"
      version = "~> 1"
    }
  }
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}
variable "source_ami" {
  type    = string
  default = "ami-06db4d78cb1d3bbf9" //ami-ids change for every region, so do not hardcode these values
}
variable "ssh_username" {
  type    = string
  default = "admin"
}

source "amazon-ebs" "debian" {
  ami_name        = "csye6225_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description = "AMI for csye6225"
  profile         = "dev"
  instance_type   = "t2.micro"
  source_ami      = "${var.source_ami}"
  ssh_username    = "${var.ssh_username}"
  region          = "${var.aws_region}"
  ami_users = [
    "327639544361", //dev
    "287116989003", //demo
  ]
  ami_regions = [
    "us-east-1",
    // "us-east-2",
    // "us-west-1",
    // "us-west-2",
  ]
}


build {
  sources = [
    "source.amazon-ebs.debian"
  ]

  provisioner "file" {
    source      = "madhura_kurhadkar_002769373_05.zip"
    destination = "~/madhura_kurhadkar_002769373_05"

  }

  provisioner "shell" {
    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
      "CHECKPOINT_DISABLE=1"
    ]
    script            = "mariadb_install.sh" // MariaDB, mysql installation on debian
    expect_disconnect = true
    valid_exit_codes  = [0, 2300218]
  }

}

