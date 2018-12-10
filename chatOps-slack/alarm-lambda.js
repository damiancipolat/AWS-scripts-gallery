const AWS = require('aws-sdk');
const Joi = require('joi');
const sns = new AWS.SNS();

//Alarm structure.
const alarmSchema = Joi.object({
  AlarmName: Joi.string(),
  AlarmDescription: Joi.string(),
  NewStateReason: Joi.string(),
  StateChangeTime: Joi.string()
});

//SNS topic message.
const snsMsgSchema = Joi.object({
  Records: Joi.array().items(Joi.object({
    EventSource: Joi.string(),
    EventVersion: Joi.string(),
    EventSubscriptionArn: Joi.string(),
    Sns: Joi.object({
      Message: Joi.string()
    })
  }))
});

const webHookUrl = 'https://hooks.slack.com/services/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';
const arnSlack   = 'arn:aws:sns:us-west-2:302353397077:slack-topic';

//Push the topic in sms.
const pushSNS = (msg,subj,arn)=>{

  return new Promise((resolve,reject)=>{

    sns.publish({    
      TargetArn: arn,
      Message: msg,
      Subject: subj
    }, (err, data)=>{

      if (err)
        reject(err);
      else
        resolve(data);

    });

  });

}

//Lambda handler.
exports.handler = async (event, context) => {

  //Validate if the event has sns message format.
  if (!Joi.validate(event,snsMsgSchema,{allowUnknown: true}).error){

    let msgBody = JSON.parse(event.Records[0].Sns.Message);

    if (!Joi.validate(msgBody,alarmSchema,{allowUnknown: true}).error!=null){

      let alarm  = msgBody;
      
      let msgObj = {
          message : `${alarm.AlarmName} : ${alarm.AlarmDescription}, ${alarm.NewStateReason} + ${alarm.StateChangeTime}`,
          webhook : webHookUrl
      };

      let result = await pushSNS(JSON.stringify(msgObj),'Alarm notification',arnSlack);
      
      return result;

    } else {
      console.log('Bad alarm format'); 
    }

  } else {
    
    console.log('Bad sns format'); 
    
  }

}