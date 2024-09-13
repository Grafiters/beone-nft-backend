pipeline {
    agent any

    environment {
        IMAGE_NAME = 'contract-craswap'
        DOCKERFILE = 'Dockerfile'
        CONTAINER_NAMES = 'craswap-contract-1'
        CONTAINER_TO_RESTARTS = 'contract'
        
        // Development Environment
        DEV_REMOTE_USER = 'royal'
        DEV_SERVER_ADDRESS = '194.233.75.125'
        DEV_DEPLOYMENT_PATH = '/home/royal/platform'
        DEV_SSH_CREDENTIALS_ID = 'ssh-dev'

        // Staging Environment
        STAGE_REMOTE_USER = 'root'
        STAGE_SERVER_ADDRESS = '46.250.226.42'
        STAGE_DEPLOYMENT_PATH = '/root/craswap'
        STAGE_SSH_CREDENTIALS_ID = 'ssh-dev'

        // Production Environment
        PROD_REMOTE_USER = 'craswap'
        PROD_SERVER_ADDRESS = '82.180.137.165'
        PROD_DEPLOYMENT_PATH = '/home/craswap/platform'
        PROD_SSH_CREDENTIALS_ID = 'ssh-dev'
        
        MATTERMOST_ENDPOINT = 'https://team.nusatech.id/hooks/gdr9ikp64pdejqxb6zd6irfjrw'
        MATTERMOST_CHANNEL = 'worldex'
        MATTERMOST_ICON = 'https://www.jenkins.io/images/logos/baturro/baturro.png'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Gather Information') {
            steps {
                script {
                    env.GIT_COMMIT = sh(script: "git rev-parse HEAD", returnStdout: true).trim()
                    env.GIT_AUTHOR = sh(script: "git log -1 --pretty=format:'%an'", returnStdout: true).trim()
                    env.GIT_MESSAGE = sh(script: "git log -1 --pretty=format:'%s'", returnStdout: true).trim()
                }
            }
        }

        stage('Prepare Environment') {
            steps {
                script {
                    if (env.BRANCH_NAME == 'main') {
                        env.IMAGE_TAG = 'prod'
                        env.REMOTE_USER = env.PROD_REMOTE_USER
                        env.SERVER_ADDRESS = env.PROD_SERVER_ADDRESS
                        env.DEPLOYMENT_PATH = env.PROD_DEPLOYMENT_PATH
                        env.SSH_CREDENTIALS_ID = env.PROD_SSH_CREDENTIALS_ID
                    } else if (env.BRANCH_NAME == 'stage') {
                        env.IMAGE_TAG = 'stage'
                        env.REMOTE_USER = env.STAGE_REMOTE_USER
                        env.SERVER_ADDRESS = env.STAGE_SERVER_ADDRESS
                        env.DEPLOYMENT_PATH = env.STAGE_DEPLOYMENT_PATH
                        env.SSH_CREDENTIALS_ID = env.STAGE_SSH_CREDENTIALS_ID
                    } else if (env.BRANCH_NAME == 'dev') {
                        env.IMAGE_TAG = 'latest'
                        env.REMOTE_USER = env.DEV_REMOTE_USER
                        env.SERVER_ADDRESS = env.DEV_SERVER_ADDRESS
                        env.DEPLOYMENT_PATH = env.DEV_DEPLOYMENT_PATH
                        env.SSH_CREDENTIALS_ID = env.DEV_SSH_CREDENTIALS_ID
                    } else {
                        error "Unsupported branch for deployment: ${env.BRANCH_NAME}"
                    }
                    withCredentials([usernamePassword(credentialsId: 'docker-devops', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
                        env.IMAGE_FULL_NAME = "${DOCKERHUB_USER}/${env.IMAGE_NAME}:${env.IMAGE_TAG}"
                    }
                }
            }
        }

        stage('Docker Build and Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-devops', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
                    script {
                        def imageExists = sh(script: "docker images -q ${env.IMAGE_FULL_NAME}", returnStdout: true).trim()
                        if (imageExists) {
                            echo "Removing existing image..."
                            sh "docker rmi -f ${env.IMAGE_FULL_NAME}"
                        }
                        echo "Building new image with tag ${env.IMAGE_TAG}..."
                        sh "docker build -t ${env.IMAGE_FULL_NAME} -f ${env.DOCKERFILE} ."
                        echo "Pushing image to Docker Hub..."
                        sh "echo $DOCKERHUB_PASS | docker login -u $DOCKERHUB_USER --password-stdin"
                        sh "docker push ${env.IMAGE_FULL_NAME}"
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    echo "Deploying to ${env.BRANCH_NAME == 'main' ? 'Production' : env.BRANCH_NAME == 'stage' ? 'Staging' : 'Development'} Environment..."
                    if (env.BRANCH_NAME == 'main') {
                        input('Approve for Production Deployment?')
                    }
                    deploy(env.REMOTE_USER, env.SERVER_ADDRESS, env.SSH_CREDENTIALS_ID)
                }
            }
        }

        stage('Check Container Status') {
            steps {
                script {
                    echo "Checking Container Status in ${env.BRANCH_NAME == 'main' ? 'Production' : env.BRANCH_NAME == 'stage' ? 'Staging' : 'Development'} Environment..."
                    checkRemoteContainerStatus(env.REMOTE_USER, env.SERVER_ADDRESS, env.SSH_CREDENTIALS_ID)
                }
            }
        }
    }

    post {
        success {
            mattermostSend(
                endpoint: "${env.MATTERMOST_ENDPOINT}", 
                channel: "${env.MATTERMOST_CHANNEL}", 
                color: '#00FF00',
                icon: "${env.MATTERMOST_ICON}",
                message: """
                    **Build Succeeded** :white_check_mark:
                    **Job**: `${env.JOB_NAME} [${env.BUILD_NUMBER}]`
                    **Branch**: `${env.BRANCH_NAME}`
                    **Environment**: `${env.BRANCH_NAME == 'main' ? 'Production' : env.BRANCH_NAME == 'stage' ? 'Staging' : 'Development'}`
                    **Commit**: `${env.GIT_COMMIT}`
                    **Author**: `${env.GIT_AUTHOR}`
                    **Message**: `${env.GIT_MESSAGE}`
                    [View Build](${env.BUILD_URL})
                    **Please check the Jenkins logs for more details.**
                """.trim()
            )
        }
        failure {
            mattermostSend(
                endpoint: "${env.MATTERMOST_ENDPOINT}", 
                channel: "${env.MATTERMOST_CHANNEL}", 
                color: '#FF0000',
                icon: "${env.MATTERMOST_ICON}",
                message: """
                    **Build Failed** :x:
                    **Job**: `${env.JOB_NAME} [${env.BUILD_NUMBER}]`
                    **Branch**: `${env.BRANCH_NAME}`
                    **Environment**: `${env.BRANCH_NAME == 'main' ? 'Production' : env.BRANCH_NAME == 'stage' ? 'Staging' : 'Development'}`
                    **Commit**: `${env.GIT_COMMIT}`
                    **Author**: `${env.GIT_AUTHOR}`
                    **Message**: `${env.GIT_MESSAGE}`
                    [View Build](${env.BUILD_URL})
                    **Please check the Jenkins logs for more details.**
                """.trim()
            )
        }
    }
}

def deploy(String remoteUser, String serverAddress, String sshCredentialsId) {
    def services = env.CONTAINER_TO_RESTARTS.split(',').collect { it.trim() }.join(' ')
    sshagent(credentials: [sshCredentialsId]) {
        sh """
            ssh -o StrictHostKeyChecking=no ${remoteUser}@${serverAddress} '
                docker rmi -f ${env.IMAGE_FULL_NAME}
                cd ${env.DEPLOYMENT_PATH}
                docker-compose up -Vd ${services} --force-recreate
                docker image prune -f
            '
        """
    }
}

def checkRemoteContainerStatus(String remoteUser, String serverAddress, String sshCredentialsId) {
    env.CONTAINER_NAMES.split(',').collect { it.trim() }.each { containerName ->
        sshagent(credentials: [sshCredentialsId]) {
            def result = sh(script: """
                ssh -o StrictHostKeyChecking=no ${remoteUser}@${serverAddress} '
                    docker container ls --filter "name=${containerName}" --format "{{.Status}}" | grep -oE "Up|Restarting|Down"
                '
            """, returnStdout: true).trim()

            checkContainerStatus(result, containerName)
        }
    }
}

def checkContainerStatus(String result, String containerName) {
    if (result == "Up") {
        echo "${containerName} container is up and running on remote server"
    } else if (result == "Restarting") {
        error "${containerName} container is restarting on remote server, please check the logs and configuration"
    } else if (result == "Down") {
        error "${containerName} container is down on remote server, please check the logs and configuration"
    } else {
        error "${containerName} container not found or unexpected status on remote server, please check the logs and configuration"
    }
}