# Introduction
The Test Track CLI allows you to submit your automated test runs from your 
CI/CD servers and submit the results to your project under your Test Track 
account. Test Track can process results from JUnit XML files which most 
CI/CD servers support

# Installation
The package is available via npm by running the following command. The below
installs it globally so its available from anywhere, supports all platforms
where Node is installed and supported. 

```shell
npm -g install Test-Track/test-track-cli
```

# Usage
In order to submit an automated test run, you first need to generate an API
key under your Test Track account. 

You can do this by going to Account & Billing in the top right menu
and then go to API keys. Then click the plus button to create a new API key. 
You can either create one API key for all your projects, but we recommend
creating an API key for each project and/or CI/CD server. 

Your CI/CD server needs to submit the result file in JUnit format and 
provide the cli the options for the API key, project id and the path to 
the file. 

To submit the result file, the command is as follows:

```shell
test-track-cli --api-key <API KEY> --project-id <PROJECT ID> --file /path/to/file/result.xml
```

e.g.

```shell
test-track-cli --api-key dofosnbssnvs --project-id 12345678 --file /my-proj/test-results/results.xml
```

If you're automated test run was submitted successfully you should see
the output `Successfully submitted output test run`.

If you get anything else, then it means something has gone wrong, either
with what data has been provided in the CLI command, or something wrong
with the Test Track API. 

Below are the responses that could be returned

**403 Forbidden**

Your API key does not match an API key against your account

**404 Not Found**

The project ID you provided was not found under your account

**503 Service Unavailable**

It should be unlikely you would receive this. This means something 
has gone wrong on the Test Track API that it couldn't process the request
at this time. 

