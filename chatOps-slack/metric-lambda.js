  const AWS         = require('aws-sdk');
  const Cloudwatch  = new AWS.CloudWatch();
    
  let random = (to,from)=>{
    return Math.floor(Math.random()*from)+to;
  }

  //Lambda function
  exports.handler = (event, context, callback) => {

    let randomVal = random(1,2000);

    const metric = {
      MetricData: [
        {
          MetricName: 'metric-slack',
          Dimensions: [
            {
              Name: 'access',
              Value: 'test'
            }
          ],
          Timestamp: new Date(),
          Unit: 'Count',
          Value: randomVal
        }
      ],
      Namespace: '/AWS/LAMBDA/ECHO'
    };


    console.log('start');

    //Push the metric into cloudwatch.
    Cloudwatch.putMetricData(metric, (err, data)=>{

      if (err)
        console.log(err, err.stack);
      else
       console.log('-->',data);

    });

    console.log('end');
    callback(null,randomVal);

  };