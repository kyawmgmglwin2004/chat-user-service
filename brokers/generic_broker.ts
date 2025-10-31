import { ServiceBroker } from "moleculer";
import config from "../configurations/config";
console.log("port: ", config.REDIS_PORT)

let theBroker = new ServiceBroker({
    namespace: "chat-app",
    nodeID : "chat-app-node-1",
    logLevel: "info",
    transporter: {
        type: "Redis",
        options: {
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
      password: config.REDIS_PASSWORD,
      db: 0,
      tls: {},
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