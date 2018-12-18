const AWS      = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB();

const params = {
  "TableName" : "users",
  "FilterExpression":"lastName = :lastName",
  "ExpressionAttributeValues":{
    ":lastName":{"S":"Cipolat"}
  },
  "ReturnConsumedCapacity":"TOTAL"
};

exports.handler = async (event) => {
    
    const result = await dynamoDb.scan(params).promise();
    
    console.log('>',result);
    return result;
    
};

//Get the webhook url by the ID.
const getWebhookByChannel = async (channelName) => {

  const params = {
    "TableName" : "channels",
    "FilterExpression":"channelName = :chName",
    "ExpressionAttributeValues":{
      ":chName":{"S":channelName}
    },
    "ReturnConsumedCapacity":"TOTAL"
  };

  let result = await dynamoDb.scan(params).promise();

  return (result.Items&&result.Items.length>0)?result.Items[0].webhookUrl.S:null;

}

//Get the webhook url by the ID.
const getWebhookByAlarm = async (alarmName) => {

  const params = {
    "TableName" : "channels",
    "FilterExpression":"contains(Alarms, :chName)",
    "ExpressionAttributeValues":{
      ":chName":{"S":channelName}
    },
    "ReturnConsumedCapacity":"TOTAL"
  };

  let result = await dynamoDb.scan(params).promise();
  console.log('x',result);
  //return (result.Items&&result.Items.length>0)?result.Items[0].webhookUrl.S:null;

}