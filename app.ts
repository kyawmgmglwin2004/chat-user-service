import broker from "./brokers/generic_broker";
import loginService from "./services/login_service";
broker.createService(loginService);


broker.start().then(async () => {
  console.log("started success");

  const getGameList = await broker.call("chat.auth.login", {
      
      

  });
  console.log("list: ", JSON.stringify(getGameList));

});
