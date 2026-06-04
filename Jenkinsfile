pipeline {
    agent any

    environment {
        DOCKER_USERNAME = credentials('docker-username')
        CLOUD_VM_IP     = credentials('cloud-vm-ip')
        SSH_KEY         = credentials('cloud-vm-ssh-key')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/au-adcs4-Tech/polyglot-cloud-migration.git',
                    credentialsId: 'github-token'
            }
        }

        stage('Pull Latest Images') {
            steps {
                sh '''
                    docker pull ${DOCKER_USERNAME}/polyglot-backend:latest
                    docker pull ${DOCKER_USERNAME}/polyglot-worker:latest
                    docker pull ${DOCKER_USERNAME}/polyglot-frontend:latest
                '''
            }
        }

        stage('Copy Deploy Files to Cloud VM') {
            steps {
                sshagent(['cloud-vm-ssh-key']) {
                    sh '''
                        scp -o StrictHostKeyChecking=no \
                            deploy/docker-compose.prod.yml \
                            ubuntu@${CLOUD_VM_IP}:/home/ubuntu/docker-compose.prod.yml
                    '''
                }
            }
        }

        stage('Deploy to Cloud VM') {
            steps {
                sshagent(['cloud-vm-ssh-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@${CLOUD_VM_IP} << 'REMOTE'
                            cd /home/ubuntu
                            export DOCKER_USERNAME=${DOCKER_USERNAME}
                            docker-compose -f /home/ubuntu/docker-compose.prod.yml pull
                            docker-compose -f /home/ubuntu/docker-compose.prod.yml up -d
                            docker ps
                        REMOTE
                    '''
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    retry(5) {
                        sleep(time: 10, unit: 'SECONDS')
                        sh "curl -f http://${CLOUD_VM_IP}:5000/api/status || exit 1"
                    }
                }
            }
        }
    }

    post {
        success {
            echo "Deployment successful! App live at http://${CLOUD_VM_IP}:3000"
        }
        failure {
            echo "Deployment FAILED. Check the logs above."
        }
    }
}
