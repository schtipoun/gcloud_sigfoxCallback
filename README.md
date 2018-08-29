# gcloud_sigfoxCallback

This code allows you to accept HTTP request from the Sigfox backend and send the data to the message queue topic of the device type defined in the callback.

Below is an example of how to define the callback on the sigfox backend:
![alt text](https://github.com/francoisoudot/gcloud_sigfoxCallback/blob/master/Screen%20Shot%202018-08-29%20at%203.36.36%20PM.png)

The URL must be the HTTP trigger endpoint provided when the function is created and the device_type will become the PubSub topic.

Basically this function handles the HTTP request, seperate the actual payload fron the metadata and publishes the payload as the PubSub data and the metadata as the attributes.

In the function getTopic, the function checks if the topic exists and if not creates it automatically.

