const request = require('request');

//Send request to slack api.
const sendToSlack = (urlSlack,message)=>{ 

  return new Promise((resolve,reject)=>{

    let msg = {
      text : message
    };

    request.post({
      uri : urlSlack,
      body: msg,
      json: true
    },(error, response, body)=>{
      
      if (error)
        reject(error);
      else
        resolve(body);

    });

  });

}

//If is sns topic.
const isNotif = (event)=>{

  return ((event.Records)&&(event.Records.length>0)&&(event.Records[0].Sns)&&(event.Records[0].Sns.Message));

}

//Lambda handler
exports.handler = async (event, context) => {

  if (event.Records){

    try{

      //If the msg come from sns.
      if (isNotif(event)){

        console.log('> sent direct from SNS');

        let {message,webhook} = JSON.parse(event.Records[0].Sns.Message);

        return await sendToSlack(webhook,message);

      }       
      
      //If the event has the rigth format.
      if ((event.message)&&(event.webhook)){

        console.log('> sent direct from parameters');

        return await sendToSlack(event.message,event.webhook);

      }

    } catch(err){

      console.log('Error in request ',err);
      return err;     

    }

  } else{

    return 'Bad parameters in invocation.';

  }

}