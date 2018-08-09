/**
 * Responds to any HTTP request.
 *
 * @param {!Object} req HTTP request context.
 * @param {!Object} res HTTP response context.
 */

// Dependencies call
const PubSub = require('@google-cloud/pubsub');
const Buffer = require('safe-buffer').Buffer;
const async = require('async');

// ENV variables for PubSub
const projectId = 'iot-test-212508';
const keyFilename = './IoT-test-cbe7dd55d30f.json';

// START PubSub
const pubsub = new PubSub({
  projectId: projectId,
  keyFilename: keyFilename
});

// Function code
exports.sigfoxCallback = (req, res) => {
  // Set the response HTTP header with HTTP status and Content type
  console.log('start');
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  // TO DO - add security feature

  // Manage post body request and check it is not empty
  var payload = req.body;
  if (isEmptyObject(payload)) {
    // This is an error case, if the json is empty
    res.status(400).send('No message defined!');
  } else {
    // Publishes the payload for the next function
    queueMessage(payload);

    // Answers to the sigfox callback
    res.status(200).end('Message processed');
  }
};

//Funtion to detect empty Object
function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

//Function to getTopic or createTopic if it doesn't exist - called by queueMessage
function getTopic(topicName, cb) {
  pubsub.createTopic(topicName, (err, topic) => {
    // topic already exists.
    if (err && err.code === 6) {
      cb(null, pubsub.topic(topicName));
      return;
    }
    cb(err, topic);
  });
}

// Fnction to publish the payload on the device type topic
function queueMessage(payload) {
  var topicName = payload.deviceType;
  getTopic(topicName, (err, topic) => {
    if (err) {
      console.log('Error occurred while getting pubsub topic', err);
      return;
    }

    const publisher = topic.publisher();
    publisher.publish(Buffer.from(JSON.stringify(payload)), err => {
      if (err) {
        console.log('Error occurred while queuing background task', err);
      } else {
        console.log(`Book queued for background processing`);
      }
    });
  });
}
