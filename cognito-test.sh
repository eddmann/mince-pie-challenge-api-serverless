#!/bin/bash

CLIENT_ID=$1
USER_POOL_ID=$2
USERNAME=$3

docker-compose run --rm aws-cli cognito-idp sign-up \
  --region eu-west-1 \
  --client-id $CLIENT_ID \
  --username $USERNAME \
  --password MySuperSecurePassw0rd! \
  --user-attributes Name=email,Value=$USERNAME@email.com

docker-compose run --rm aws-cli cognito-idp admin-confirm-sign-up \
  --region eu-west-1 \
  --user-pool-id $USER_POOL_ID \
  --username $USERNAME

docker-compose run --rm aws-cli cognito-idp admin-initiate-auth \
  --region eu-west-1 \
  --user-pool-id $USER_POOL_ID \
  --client-id $CLIENT_ID \
  --auth-flow ADMIN_NO_SRP_AUTH \
  --query AuthenticationResult.IdToken \
  --output text \
  --auth-parameters USERNAME=$USERNAME,PASSWORD=MySuperSecurePassw0rd!
