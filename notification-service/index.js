//Notification service is to consuume the message from the task service.

import amqp from "amqplib";

let channel, connection;

async function start() {
    try {
        connection = await amqp.connect("amqp://rabbitmq");
        channel = await connection.createChannel();
        
        await channel.assertQueue("task_created");
        console.log("Notification service is listening to messages");

        channel.consume("task_created", (msg) => {
            const taskData = JSON.parse(msg.content.toString()); //convert from binary to js object
            console.log("Notification: NEW Task: ", taskData.title);
            console.log("Notification: NEW Task: ", taskData);
            channel.ack(msg);
        });
    } catch (error) {
        console.log(`Error connecting to RabbitMQ: ${error}`);
    }
}

start();