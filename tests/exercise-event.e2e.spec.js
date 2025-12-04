const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

//sample user from the json
const USER_ID = '8374d8b2-7041-70bf-e0a2-7cb9b9d8576c';

test.describe('Exercise Event Flow - Happy Path', () => {
  test('should create exercise event, upload video, and get scored results', async ({ request }) => {
    // CREATE EXERCISE EVENT
    const createResponse = await request.post(`/exercise/v1/user/${USER_ID}/exercise-event`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        exerciseId: '34',
        fileExtension: 'mov',
        //5 MB
        fileSize: 5242880,
      },
    });

    //Assertion
    expect(createResponse.status()).toBe(201);

    const createBody = await createResponse.json();
    const exerciseEventId = createBody.exerciseEventId;
    let uploadUrl = createBody.uploadUrl;

    expect(exerciseEventId).toBeTruthy();
    expect(uploadUrl).toBeTruthy();

    // Sometimes Mocks do not return the Url with '/'
    if (!uploadUrl.startsWith('/')) {
      uploadUrl = '/' + uploadUrl;
    }

    // upload Event
    const dummyFilePath = path.join(__dirname, 'dummy-video.txt');

    if (!fs.existsSync(dummyFilePath)) {
      fs.writeFileSync(dummyFilePath, 'This simulates binary video data for testing.');
    }

    const fileBuffer = fs.readFileSync(dummyFilePath);

    const uploadResponse = await request.put(uploadUrl, {
      headers: {
        'Content-Type': 'video/quicktime', // content type isn't really checked by Mockoon
      },
      data: fileBuffer,
    });

    //Assertion
    expect(uploadResponse.status()).toBe(200);

    // Verify Status
    const maxAttempts = 6;
    const waitMs = 200;

    let finalStatus = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const statusResponse = await request.get(`/exercise/v1/exercise-event/${exerciseEventId}`);

      expect(statusResponse.status()).toBe(200);

      const body = await statusResponse.json();
      console.log(`Attempt ${attempt}: status = ${body.status}`);

      if (body.status === 'scored') {
        finalStatus = body;
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }

    // Assertion - Final Status
    expect(finalStatus, 'Exercise event should reach scored status').not.toBeNull();
    expect(finalStatus.status).toBe('scored');

    // Assertion - score
    expect(finalStatus.score).toBeDefined();

    // Assertion - analysisResults
    expect(finalStatus.analysisResults.length).toBeGreaterThan(0);

    const firstResult = finalStatus.analysisResults[0];
    const distance = firstResult.measurementData.distance;

    //Assertion
    expect(distance.unit).toBe('m');
    expect(distance.value).toBeGreaterThan(0);
  });
});
