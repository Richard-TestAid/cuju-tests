1 . Negative Scenarios & Edge Cases
The following Negative scenarios are critical in a real CUJU flow. We need to
prioritize the following:

a. Create Exercise Event:
Scenario 1: 
When API User enter Invalud userId format (empty or null or uuid)
Then System Ensures API Correctly validates path parameters and resturn 400/404

Scenario 2:
When User uploads Unsupported FileExtension (.exe or .pdf)
Then Syste, prevents uploading invalid file types

Scenario 3:
When user Missing required fields in request body
Then Backend ensures API enforces schema validation

b. Upload file Event:
Scenario 1:
When User PUT request to an expired or invalud uploadUrl
Then System ensures proper handling of invalid URL's

Scenario 2:
When User Missing "Content-Type" header
Then System should enforce correct types

Scenario 3:
When user uploading empty file
Then System prevents the empty file

Scenario 4:
When User upload file larger then allows
Then System protects against oversized vidoes

Scenario 5:
When user sent Upload Event before Create Event
Then System ensures correct API workflow sequence

c. Event Status
Scenario 1:
When user send invalid exerciseId
Then System Ensures the server returns 400/404 

Scenario 2:
When user see Polling beyond timeout without reaching "scored" status
Then System Ensures the test handles long-running async tasks

Scenraio 3:
When user see the event stucked in "uploaded" status
Then system show the backend pricessing issues

d. General Scenarios

Authentication Missing/invalid
Rate Limiting
Server returning 500/503 errors


2 . Handling Long-Running Event-Driven Workflows

In the real CUJU platform, video analysis may take several minutes. For such asynchronous flows:

A. Use Polling with smart timeouts
B. Exponential Backoff strategy
C. Mocking Long processes in Local Tests
D. Configuration-Based timeouts

3 . Test Framework Setup & Test Data Management

A. Project Structure as per Playwright

Project/
    |- tests/
        |- create-event.spec.js
        |- upload-file.spec.js
        |- poll-status.spec.js
        |- exercise-event-e2e.spec.js
    |- test-strategt.md
    |- playwright.config.js
    |- README.md
    
B. Environment Management

Use baseURL in config and we can use & execute tests in diffeent environment like dev, QA , Staging, Demo & production 

C. Test Data

We can use Unique User ID;s on each run to avoid conflicts
We can delete events after each test if backend allows
We can use fixtures for data reuse

D. Parallel Execution

I think Playwright runs tests in parallel by default but we will have some issue when we run tests which create events with same
ID's like Exercise event ID & user ID

We can have different group of tests to make sure the tests are always fine like Smoke API test, E2E nightly tests


Thanks. 

