//this folder I create for initialise all the data which is written in data.js and save it to database

const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing.js")
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
.then(()=>{
    console.log("connect to database");
})

.catch((err)=>{
    console.log(err)
})

async function main(){
    await mongoose.connect(MONGO_URL)
}

const initDb = async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"67a6f606d1e21122be259426"}))
    await Listing.insertMany(initData.data);
    console.log("data was initialized")
};
initDb();