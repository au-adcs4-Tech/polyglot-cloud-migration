output "instance_public_ip" {
  description = "Public IP of the cloud VM"
  value       = aws_instance.app.public_ip
}

output "instance_public_dns" {
  description = "Public DNS of the cloud VM"
  value       = aws_instance.app.public_dns
}

output "frontend_url" {
  description = "URL to access the frontend"
  value       = "http://${aws_instance.app.public_ip}:3000"
}

output "api_url" {
  description = "URL to access the .NET API"
  value       = "http://${aws_instance.app.public_ip}:5000/api/status"
}

output "ssh_command" {
  description = "SSH command to connect to the VM"
  value       = "ssh -i ~/.ssh/id_rsa ubuntu@${aws_instance.app.public_ip}"
}
