#!/usr/bin/env node

import * as fs from 'fs';
import {FileNotFoundException} from "./exceptions/FileNotFoundException";
import {ResultFileEmptyException} from "./exceptions/ResultFileEmptyException";
import axios from "axios";
import {InvalidDataException} from "./exceptions/InvalidDataException";
import * as path from "node:path";
import {InvalidCommandException} from "./exceptions/InvalidCommandException";

type FilesToProcess = {file_name: string, file_content: string}

const yargs = require("yargs");

const fileToBase64 = (filePath: string) => {
    const fileBuffer = fs.readFileSync(filePath);
    const base64Data = fileBuffer.toString('base64');
    return base64Data;
}

const sendRequest = async (data: any) => {
    //const url = 'https://app.test-track.com/backend/api/automated-test-run';
    const url = 'https://staging-app.test-track.com/api/automated-test-run';

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
    .option("version", {alias: "v", description: "Show version number", type: "boolean"})
    .option("key", { alias: "api-key", describe: "Company API Key", type: "string", demandOption: true })
    .option("id", {alias: "project-id", describe: "Project id you are submitting the automated test run against", type: "string", demandOption: true})
    .option("file", {alias: "file", description: "JUnit XML File path", demandOption: false})
    .option("directory", {alias: "directory", description: "Path to where are all JUnit XML files are stored. Any non XML files will be ignored", type: "string", demandOption: false})
    .option("branch", {alias: "branch", description: "The branch name this test run is for, if not provided it will default to main", type: "string"})
    .option("tags", {alias: "tags", description: "Tags to be added to the test run, comma separated no spaces", type: "string"})
    .argv;

const apiKey = options['api-key'];
const projectId = options['project-id'];
const file = options.file;
const directory = options.directory;

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

    if (typeof file !== typeof undefined && typeof directory !== typeof undefined)
    {
        throw new InvalidCommandException("You cannot use both --file and --directory at the same time");
    }

    const data : {project_id: string, file_name?: string, file_content?: string, files?: string, branch?: string, tags?: string} = {
        project_id: projectId
    }
    if (file?.length > 0) {

        if (!fs.existsSync(file))
        {
            throw new FileNotFoundException(file);
        }

        data.file_name = path.basename(file);
        data.file_content = fileToBase64(file);
    }
    else if (directory?.length > 0)
    {
        if (!fs.existsSync(directory))
        {
            throw new FileNotFoundException(file);
        }

        const files = fs.readdirSync(directory);
        const processFiles : FilesToProcess[] = [];
        files.forEach(file => {
            if (path.extname(file) === '.xml') {

                processFiles.push({
                    file_name: path.basename(`${directory}/${file}`),
                    file_content: fileToBase64(`${directory}/${file}`)
                });

            }
        })
        // @ts-ignore
        data.files = processFiles;
        if (data.files.length === 0)
        {
            throw new ResultFileEmptyException(directory);
        }
    }
    else {
        throw new InvalidCommandException("At least --file or --directory must be specified");
    }
    data.branch = options?.branch?.length > 0 ? options?.branch : "main";
    data.tags = options?.tags?.length > 0 ? options?.tags : "";
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
            if (typeof response?.status !== typeof undefined && typeof response?.statusText !== typeof undefined) {
                console.log(`Status Code: ${response.status} - ${response.statusText}`);
            }
            if (typeof response?.data !== typeof undefined)
            {
                console.log(response.data);
            }

        }
    }).catch(err => {
        console.error("An unexpected error occurred submitting the automated test run to Test Track",);
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
    else if (err instanceof InvalidCommandException)
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

