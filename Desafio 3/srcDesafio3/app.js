import exress from "express";
import {productManager} from "./productManager.js";

const app = exress();

const port = 8080;
const manager = new productManager();