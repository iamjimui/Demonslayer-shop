provider "aws" {
    access_key = "${var.access_key}"
    secret_key = "${var.secret_key}"
    region = "eu-west-3"
}

data "aws_security_group" "umaishop-api-sg" {
  id = "${var.sg_id}"
}

data "template_file" "user_data" {
  template = "${file("execute.sh")}"
}

resource "aws_instance" "ec2_instance" {
    ami = "${var.ami_id}"
    instance_type = "${var.instance_type}"
    key_name = "${var.ami_key_pair_name}"
    vpc_security_group_ids = [data.aws_security_group.umaishop-api-sg.id]

    connection {
      type = "ssh"
      host = self.public_ip
      user = "ubuntu"
      private_key = "${file("c2wk.pem")}"
    }
    provisioner "remote-exec" {
      inline = [
        "sudo apt update",
        "sudo apt install -y git",
        "sudo apt-get install -y ca-certificates curl gnupg",
        "sudo install -m 0755 -d /etc/apt/keyrings",
        "curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg",
        "sudo chmod a+r /etc/apt/keyrings/docker.gpg",
        "echo \"deb [arch=\"$(dpkg --print-architecture)\" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \"$(. /etc/os-release && echo \"$VERSION_CODENAME\")\" stable\" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null",
        "sudo apt-get update",
        "sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin",
        "curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 && chmod +x minikube",
        "sudo mkdir -p /usr/local/bin/",
        "sudo install minikube /usr/local/bin/",
        "git clone (link_to_repository)",
        "cd ~/group-1004268/Docker/AWS/",
        "sudo docker compose up -d",
      ]
    }
}

data "aws_eip" "my_instance_eip" {
  public_ip = "13.39.172.124"
}

resource "aws_eip_association" "my_eip_association" {
  instance_id   = aws_instance.ec2_instance.id
  allocation_id = data.aws_eip.my_instance_eip.id
}

