# gcloud_sigfoxCallback

This code allows you to accept HTTP request from the Sigfox backend and send the data to the message queue topic of the device type defined in the callback.

Below is an example of how to define the callback on the sigfox backend:
![alt text](https://github.com/francoisoudot/gcloud_sigfoxCallback/blob/master/Screen%20Shot%202018-08-29%20at%203.36.36%20PM.png)


If the topic does not exist it will create it automatically.
