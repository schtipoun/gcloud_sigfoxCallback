# gcloud_sigfoxCallback

This code allows you to accept HTTP request from the Sigfox backend and send the data to the message queue topic of the device type defined in the callback.


## Configuring the sigfox backend

Below is an example of how to define the callback on the sigfox backend:
![alt text](https://github.com/francoisoudot/gcloud_sigfoxCallback/blob/master/Screen%20Shot%202018-08-29%20at%203.36.36%20PM.png)

The URL must be the HTTP trigger endpoint provided when the function is created and the device_type will become the PubSub topic.


## Creating your GCP function

In your function folder, add an index.js file and copy paste the code.
Then, you will need to update your project name and private key name. You will need to add a private key in your folder to be able to publish on your PubSub 

'''
const projectId = YOUR_PROJECT_ID; //TO BE MODIFIED
const keyFilename = YOUR_PRIVATE_KEY; //TO BE MODIFIED
'''

Finally, in this function we are using 2 npm dependencies that you will have to setup in your environment:
npm install --save @google-cloud/pubsub
npm install --save safe-buffer

Finally, you will have to deploy:
'''
gcloud functions deploy FUNCTION NAME --trigger-http
'''

Now your http endpoint is: 
'''
https://<YOUR ZONE>-<YOUR PROJECT>.cloudfunctions.net/<YOUR FUNCTION>
'''
Congrats, you have a message broker up and running scalable to infinity.


## Explaining the code

Basically this function handles the HTTP request, seperate the actual payload from the metadata and publishes the payload as the PubSub data and the metadata as the attributes.

In the function getTopic, the function checks if the topic exists and if not creates it automatically.

One neat feature is that you do not need to create any PubSub messaging topic ahead of time since if they do not exist they are created automatically. Imagine in the future that you start receiving messages from a new device type, the messages will autonmatically be queued for 7 days in the PubSub messaging system. This gives you a lot of flexibility!



## IMPROVEMENTS:
+ Security should be improved by defining a login and secure key in the header of the HTTP request in the sigfox callback and checking their values in the function.

