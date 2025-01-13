import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const platforms = [{
    name: 'app.proofofskill.org',
    url: 'https://ap.proofofskill.org',
}];
export const handler = async (event) => {
    const webhook = process.env.SLACK_WEBHOOK;
    if (!webhook) {
        throw new Error('Missing SLACK_WEBHOOK environment variable');
    }
    let downPlatforms = [];
    const promises = platforms.map(async platform => {
        try {
            await axios.get(platform.url);
            return {
                ...platform,
                status: 'UP',
            };
        } catch (error) {
            return {
                ...platform,
                status: 'DOWN',
                error: error.message,
            };
        }
    });
    const results = await Promise.all(promises);
    downPlatforms = results.filter(platform => platform.status === 'DOWN');
    if (downPlatforms.length > 0) {
        const message = downPlatforms.map(platform => `:x: ${platform.name} is down\n:warning: Error: ${platform.error}`).join('\n');
        let data = {
            text: message,
        };
        await axios.post(webhook, data, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
    }
    // TODO implement
    const response = {
      statusCode: 200,
      body: JSON.stringify(`Health checker ran. Timestamp: ${new Date().toISOString()}`),
    };
    return response;
  };
  handler();