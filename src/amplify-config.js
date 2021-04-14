const amplifyConfig = {
    "aws_cognito_region": process.env.REACT_APP_AWSCOGNITO_region,
    "aws_user_pools_id": process.env.REACT_APP_AWSUSER_pools_id,
    "aws_user_pools_web_client_id": process.env.REACT_APP_AWSUSER_pools_web_client_id
};

export default amplifyConfig;