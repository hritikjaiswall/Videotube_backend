import dotenv from "dotenv";
import connectDB from "./db/DBindex.js"; // This is correct
import { app } from "./app.js";

dotenv.config(); // this will correctly load the .env file

// dotenv.config({
//     path: './env'
// });

// import dotenv from "dotenv";
// dotenv.config({ path: './env' }); // Or just dotenv.config(); if using .env

// import connectDB from "./db/DBindex.js";
// import { app } from "./app.js";

connectDB()
.then(() => {
app.listen(process.env.PORT||8000,()=>{
    console.log("Server is running on port",process.env.PORT||8000);    
// app.listen(8000, () => {
//     console.log("Server is running on port 8000");
});
}).catch((err)=>{
    console.log("Mongo DB server failed ",err);
})
 