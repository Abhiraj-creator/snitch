import app from "./src/app.js";
import { ConnectTODb } from './src/config/database.js';

ConnectTODb();

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`server is running at port ${PORT}`);
})