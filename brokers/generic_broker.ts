import { ServiceBroker } from "moleculer";

let theBroker = new ServiceBroker({
    namespace: "chat-app",
    nodeID : "chat-app-node-1",
    logLevel: "info",
    transporter: {
        type: "Redis",
        options: {
            host: "localhost",
            port: 6379,
        },
    },

    cacher: "Redis",
    logger: true,
    created(broker) {
        broker.logger.info("created");
    },
    started(broker) {
        broker.logger.info("started");
    },
    stopped(broker) {
        broker.logger.info("stopped");
    },
});

export default theBroker;