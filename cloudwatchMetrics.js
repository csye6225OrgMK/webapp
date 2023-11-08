const AWS = require('aws-sdk');
const cloudwatch = new AWS.CloudWatch({ region: 'us-east-1' });
const StatsD = require('node-statsd');
const client = new StatsD({ host: 'demo.talentofpainting.info', port: 8125 });


function sendApiMetrics(route) {
  cloudwatch.putMetricData({
    MetricData: [
      {
        MetricName: 'CountAPIEndpointSuccess',
        Dimensions: [{ Name: 'Endpoint', Value: route }],
        Value: 1, // Increase this value for each hit
      },
    ],
    Namespace: 'webapp',
  }, (err, data) => {
    if (err) {
      console.error('Error publishing metric to CloudWatch:', err);
    }
  });
}

module.exports = { sendApiMetrics };
