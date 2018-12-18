const AWS      = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB();

const params = {
  "TableName" : "users",
  "Item":{
    "userId":{"S":"003"},
    "firstName":{"S":"Damian"},
    "lastName":{"S":"Cipolat"},
  },
  "ReturnConsumedCapacity":"TOTAL"
};

exports.handler = async (event) => {
    
    const result = await dynamoDb.putItem(params).promise();
    
    console.log('>',result);
    return result;
    
};

