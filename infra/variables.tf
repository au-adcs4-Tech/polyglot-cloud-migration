variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name tag applied to all resources"
  type        = string
  default     = "polyglot-cloud"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.small"
}

variable "ssh_public_key" {
  description = "SSH public key material for EC2 access"
  type        = string
}

variable "allowed_ssh_cidr" {
  description = "Your IP in CIDR notation for SSH access"
  type        = string
  default     = "0.0.0.0/0"
}
