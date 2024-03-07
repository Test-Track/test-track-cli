#!/usr/bin/env node
"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="86a0b079-850c-569b-895f-70015b522c62")}catch(e){}}();

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const FileNotFoundException_1 = require("./exceptions/FileNotFoundException");
const ResultFileEmptyException_1 = require("./exceptions/ResultFileEmptyException");
const axios_1 = __importDefault(require("axios"));
const console = __importStar(require("console"));
const InvalidDataException_1 = require("./exceptions/InvalidDataException");
const Sentry = __importStar(require("@sentry/node"));
const profiling_node_1 = require("@sentry/profiling-node");
Sentry.init({
    dsn: "https://f70bc503be4cf0bcc9ffc284ecf42bc6@o4504350151081984.ingest.sentry.io/4506503849967616",
    integrations: [
        new profiling_node_1.ProfilingIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
});
const yargs = require("yargs");
const fileToBase64 = (filePath) => {
    const fileBuffer = fs.readFileSync(filePath);
    const base64Data = fileBuffer.toString('base64');
    return base64Data;
};
const sendRequest = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const url = 'http://test-track.home.com/backend/api/automated-test-run';
    const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
    try {
        return yield axios_1.default.post(url, data, { headers: headers });
    }
    catch (err) {
        throw err;
    }
});
const options = yargs
    .usage("Usage: --api-key <API Key> --project-id <Project ID>")
    .option("key", { alias: "api-key", describe: "Company API Key", type: "string", demandOption: true })
    .option("id", { alias: "project-id", describe: "Project id you are submitting the automated test run against", type: "string", demandOption: true })
    .option("file", { alias: "file", description: "JUnit XML File path", demandOption: true })
    .argv;
const apiKey = options['api-key'];
const projectId = options['project-id'];
const file = options.file;
try {
    if (apiKey.length === 0) {
        throw new InvalidDataException_1.InvalidDataException("api-key");
    }
    else if (projectId.length === 0) {
        throw new InvalidDataException_1.InvalidDataException("project-id");
    }
    else if (file.length === 0) {
        throw new InvalidDataException_1.InvalidDataException("file");
    }
    if (!fs.existsSync(file)) {
        throw new FileNotFoundException_1.FileNotFoundException(file);
    }
    const base64 = fileToBase64(file);
    if (base64.length === 0) {
        throw new ResultFileEmptyException_1.ResultFileEmptyException(file);
    }
    const data = {
        project_id: projectId,
        file_content: base64
    };
    sendRequest(data).then(response => {
        //We should get no other response here other than 200 OK. Any 4xx or 5xx errors
        //are caught by the catch handler
        if (response.status === 200) {
            console.info("Successfully submitted automated test run");
            console.info("Your test run is added to a queue and you should see the results shortly");
            console.info("An email notification will be sent once your test run has been processed");
        }
        else {
            console.log(`Received unexpected response code: ${response.status}: ${response.statusText}`);
            console.log("If you continue to see this, please raise a support ticket at https://support.devso.io and include the information below");
            console.log(`Status Code: ${response.status} - ${response.statusText}`);
            console.log(response.data);
        }
    }).catch(err => {
        console.error("An unexpected error occurred submitting the automated test run to Test Track");
        console.error("If you continue to see this problem, please raise a support ticket at https://support.devso.io with the details outputted below");
        console.error("Status: " + err.response.status + ": " + err.response.statusText);
        console.error("Err", err.response.data);
    });
}
catch (err) {
    if (err instanceof FileNotFoundException_1.FileNotFoundException) {
        console.error(err.message);
    }
    else if (err instanceof ResultFileEmptyException_1.ResultFileEmptyException) {
        console.error(err.message);
    }
    else if (err instanceof InvalidDataException_1.InvalidDataException) {
        console.error(err.message);
    }
    else {
        console.error("An unexpected error has occurred submitted your automated test run to Test Track");
        console.error("If you continue to see this error, please raise a support ticket at https://support.devso.io with the output below");
        console.error("An exception has occurred", err);
    }
}
//# sourceMappingURL=index.js.map
//# debugId=86a0b079-850c-569b-895f-70015b522c62
