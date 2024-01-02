#!/usr/bin/env node

import * as fs from 'fs';
import {FileNotFoundException} from "./exceptions/FileNotFoundException";
import {ResultFileEmptyException} from "./exceptions/ResultFileEmptyException";
import axios from "axios";
import * as console from "console";
import {InvalidDataException} from "./exceptions/InvalidDataException";
import * as Sentry from "@sentry/node";
import { ProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
    dsn: "https://f70bc503be4cf0bcc9ffc284ecf42bc6@o4504350151081984.ingest.sentry.io/4506503849967616",
    integrations: [
        new ProfilingIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
});

const yargs = require("yargs");

const fileToBase64 = (filePath: string) => {
    const fileBuffer = fs.readFileSync(filePath);
    const base64Data = fileBuffer.toString('base64');
    return base64Data;
}

const sendRequest = async (data: any) => {
    const url = 'http://test-track.home.com/backend/api/automated-test-run';

    const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    try
    {
        return await axios.post(url, data, {headers: headers});
    }
    catch (err)
    {
        throw err;
    }
}


const options = yargs
    .usage("Usage: --api-key <API Key> --project-id <Project ID>")
    .option("key", { alias: "api-key", describe: "Company API Key", type: "string", demandOption: true })
    .option("id", {alias: "project-id", describe: "Project id you are submitting the automated test run against", type: "string", demandOption: true})
    .option("file", {alias: "file", description: "JUnit XML File path", demandOption: true})
    .argv;

const apiKey = options['api-key'];
const projectId = options['project-id'];
const file = options.file;



try
{
    if (apiKey.length === 0)
    {
        throw new InvalidDataException("api-key");
    }
    else if (projectId.length === 0)
    {
        throw new InvalidDataException("project-id")
    }
    else if (file.length === 0)
    {
        throw new InvalidDataException("file");
    }

    if (!fs.existsSync(file))
    {
        throw new FileNotFoundException(file);
    }

    const base64 = fileToBase64(file);
    if (base64.length === 0)
    {
        throw new ResultFileEmptyException(file);
    }

    const data = {
        project_id: projectId,
        file_content: base64
    }

    sendRequest(data).then(response => {
        //We should get no other response here other than 200 OK. Any 4xx or 5xx errors
        //are caught by the catch handler
        if (response.status === 200)
        {
            console.info("Successfully submitted automated test run");
            console.info("Your test run is added to a queue and you should see the results shortly")
            console.info("An email notification will be sent once your test run has been processed");
        }
        else
        {
            console.log(`Received unexpected response code: ${response.status}: ${response.statusText}`);
            console.log("If you continue to see this, please raise a support ticket at https://support.devso.io and include the information below");
            console.log(`Status Code: ${response.status} - ${response.statusText}`);
            console.log(response.data);
        }
    }).catch(err => {
        console.error("An unexpected error occurred submitting the automated test run to Test Track");
        console.error("If you continue to see this problem, please raise a support ticket at https://support.devso.io with the details outputted below")
        console.error("Status: " + err.response.status + ": " + err.response.statusText);
        console.error("Err", err.response.data);
    });
}
catch (err)
{
    if (err instanceof FileNotFoundException)
    {
        console.error(err.message);
    }
    else if (err instanceof ResultFileEmptyException)
    {
        console.error(err.message);
    }
    else if (err instanceof InvalidDataException)
    {
        console.error(err.message);
    }
    else
    {
        console.error("An unexpected error has occurred submitted your automated test run to Test Track");
        console.error("If you continue to see this error, please raise a support ticket at https://support.devso.io with the output below");
        console.error("An exception has occurred", err);
    }
}

