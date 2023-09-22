import mongoose from "mongoose";
import { productManagerDb } from "../dao/managers/productManager.mongo.js";
import Assert from "assert";

mongoose.connect("mongodb+srv://danielavilap:rYTCongFxqhiu8tC@cluster0.p9kkhbw.mongodb.net/ecommerceTests?retryWrites=true&w=majority");


const assert = Assert.strict;

describe("Testing de productos dao",()=>{
    it("")
})