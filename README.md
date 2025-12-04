# cuju-tests
Hey All, 
This repositroy is for automated API tests of CUJU Exercise Event flow. We used Playwrigght API tests and a Mockoon for Backend. 

The goal is validate the CUJU End-2-End flow:
1 . Create /Post New Exercide event
2 . Upload the video file (binary)
3 . Poll event status until "Scored"
4 . Validate Scoring & Analysis results
5 . Generate HTML Report

Pre-Requisites:
Please make sure the following tools are installed:
1 . Node (Install via brew) "brew install node"
2 . Playwrght tests "npm install -D @playwright/test
3 . Mockoon (Install via brew) "brew install --cask mockoon"

Execution:

1 . clone this repository in local
2 . make sure you have the following structure of files in the repo. 
    cuju - tests
    |
    |- tests/
    |    = exercise-event.e2e.spec.js
    |
    |- playwright.config.js
    |- package.json
    |- package-lock.json
    |- README.md

3 . Go to the terminal and execute the follow commands:
    "npx playwright test"
4 . Test will execute and can see the command for see the Report command "npx playwright show-report" then it will open the Browser 
    
