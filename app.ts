import broker from "./brokers/generic_broker";
import loginService from "./services/login_service";
broker.createService(loginService);


broker.start().then(async () => {
  console.log("started success");

  const login = await broker.call("auth.login.login", {
      
      email : "kyaw@gmail.com",
        password : "mypassword"

  });
  console.log("list: ", JSON.stringify(login));

});
