const AWS      = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB();

const params = {
  "TableName" : "users",
  "Key":{
    "userId":{"S":"001"}
  },
  "ReturnConsumedCapacity":"TOTAL",
  "UpdateExpression":"SET #LN = :t, #NOL = :n",
  "ExpressionAttributeNames":{
    "#LN" :"lastName",
    "#NOL":"NoOfLogins"
  },  
  "ExpressionAttributeValues":{
    ":t":{"S":"Chauhan"},
    ":n":{"N":"1"}
  },
  "ReturnConsumedCapacity":"TOTAL"
};

exports.handler = async (event) => {
    
    const result = await dynamoDb.updateItem(params).promise();
    
    console.log('>',result);
    return result;
    
};
