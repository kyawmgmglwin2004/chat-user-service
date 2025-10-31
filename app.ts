import broker from "./brokers/generic_broker";
import loginService from "./services/login_service";
broker.createService(loginService);


broker.start().then(async () => {
  console.log("started success");

  // const login = await broker.call("auth.login.login", {
      
  //     email : "kyawmgmglwin146018@gmail.com",
  //     password : "password"

  // });
  // console.log("list: ", JSON.stringify(login));
  // const login = await broker.call("auth.login.login", {
      
  //     email : "kyawmgmglwin3@gmail.com",
  //     password : "password",
  //     userName: "KyawGyi",
  //     phone: "09796582826

  // });
  // console.log("register: ", JSON.stringify(login));


});
