require("dotenv").config();
export const uri = "mongodb+srv://"+`${process.env.LOGIN_MONGODB}`+":"+`${process.env.PASSWORD_MONGODB}`+"@mycluster.ui84d.mongodb.net/destination-api?retryWrites=true&w=majority";