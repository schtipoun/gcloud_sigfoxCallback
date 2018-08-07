/**
 * Responds to any HTTP request.
 *
 * @param {!Object} req HTTP request context.
 * @param {!Object} res HTTP response context.
 */

require('@google-cloud/trace-agent').start();
require('@google-cloud/debug-agent').start();
// const PubSub = require('@google-cloud/pubsub');

exports.sigfoxCallback = (req, res) => {
  //Set the response HTTP header with HTTP status and Content type
  console.log('start');
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  //TO DO - add security feature

  //manage post body request - library can be used
  if (isEmptyObject(req.body)) {
    // This is an error case, if the json is empty
    res.status(400).send('No message defined!');
  } else {
    //decode payload - can be splited in another function
    let decode;
    try {
      decode = decodePayload(req.body);
    } catch (err) {
      console.log('parsing error', err);
      return res.status(500).end('Parsing error!');
    }
    //decoding worked
    // Your Google Cloud Platform project ID
    const projectId = 'iot-test-212508';

    // Instantiates a client
    const pubsubClient = new PubSub({
      projectId: projectId
    });

    // The name for the new topic
    const topicName = 'SFX-TOTAL-TEMP';

    // Creates the new topic
    pubsubClient
      .createTopic(topicName)
      .then(results => {
        const topic = results[0];
        console.log(`Topic ${topic.name} created.`);
      })
      .catch(err => {
        console.error('ERROR:', err);
      });
    // const pubsub = new PubSub();
    // pubsub
    //   .topic('SFX-TOTAL-TEMP')
    //   .publisher()
    //   .publish(decode)
    //   .then(messageId => {
    //     console.log(`Message ${messageId} published.`);
    //   })
    //   .catch(err => {
    //     console.error('ERROR:', err);
    //   });
    res.status(200).end('Decoding worked!');
  }
};

//script to decode payload
function decodePayload(body) {
  //Main
  var data = body.data; //data.body.data c90002540c
  var time = body.time;
  var mode = data.slice(2, 4);
  let res = {};

  switch (mode) {
    case '00': //values 1st frame - c90002540cbf00eb00eb00eb
      var temp_T0 = new Temp(parseInt(time), data.slice(10, 14));
      var temp_T0_20 = new Temp(time - 20 * 60, data.slice(14, 18));
      var temp_T0_40 = new Temp(time - 40 * 60, data.slice(18, 22));
      var LSB_temp_T0_60 = data.slice(22, 24);
      res = { temp_T0, temp_T0_20, temp_T0_40 };
      console.log(res);

      return res;
      break;

    case '10': //values 2nd frame -
      var LSB_temp_T0_60 = payload.data.body.LSB_temp_T0_60;
      var temp_T0_60 = new Temp(
        time - 60 * 60,
        LSB_temp_T0_60.concat(data.slice(4, 6))
      );
      var temp_T0_80 = new Temp(time - 80 * 60, data.slice(6, 10));
      var temp_T0_100 = new Temp(time - 100 * 60, data.slice(10, 14));
      break;

    case '01': //values etendues - c901000006e800ed00e400
      var temp_moy = parseTemp(data.slice(10, 14));
      var temp_max = parseTemp(data.slice(14, 18));
      var temp_min = parseTemp(data.slice(18, 22));
      break;

    case '02': //alarmes - c9020001 alarm on - c9020000 alarm off
      var alarm = data.slice(7, 8) == '1'; //boolean
      break;
    case '03': //value systeme - c9030024d80103000000
      var battery = parseInt('0x'.concat(data.slice(6, 8))) / 10; //voltage of battery
      break;
  }

  //Models

  function Temp(time, temp) {
    this.data = parseTemp(temp);
    this.time = time;
  }

  //Functions
  function parseTemp(temp) {
    return (
      parseInt('0x'.concat(temp.slice(2, 4).concat(temp.slice(0, 2)))) / 10
    );
  }
}

function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}
