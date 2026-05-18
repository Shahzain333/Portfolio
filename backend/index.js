
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/mongodb.js";

// configuration of dotenv
dotenv.config();

connectDB().then(() => {
    
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on on port: at http://localhost:${process.env.PORT}`);
    })

}).catch((err) => {
    console.log(`Mongodb Connection error :: ${err}`)
})