import app from "./src/app.js";
import { ConnectTODb } from './src/config/database.js';

ConnectTODb();

app.listen(3000,()=>{
    console.log('server is running at port 3000');
})