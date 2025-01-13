import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const platforms = [{
    name: 'app.proofofskill.org',
    url: 'https://app.proofofskill.org',
}, {
    name: 'get.proofofskill.org',
    url: 'https://get.proofofskill.org',
}, {
    name: 'skills.cv',
    url: 'https://skill.cv',
}, {
    name: 'endorse.proofofskill.org',
    url: 'https://endorse.proofofskill.org',
}, {
    name: 'app-dev.proofofskill.org',
    url: 'https://app-dev.proofofskill.org',
}, {
    name: 'get-dev.proofofskill.org',
    url: 'https://get-dev.proofofskill.org',
}, {
    name: 'dev.skills.cv',
    url: 'https://dev.skills.cv',
}, {
    name: 'endorse-dev.proofofskill.org',
    url: 'https://endorse-dev.proofofskill.org',
}, {
    name: 'api.proofofskill.org',
    url: 'https://api.proofofskill.org/v1.0.0/api',
}, {
    name: 'api-dev.proofofskill.org',
    url: 'https://api-dev.proofofskill.org/v1.0.0/api',
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
        const message = downPlatforms.map(platform => 
            `:x: *${platform.name}* is down\n*Error:* ${platform.error}`
        ).join('\n\n------------------------\n\n');
    
        let data = {
            text: `<!channel>\n${message}`,
        };
    
        await axios.post(webhook, data, {
            headers: {
              'Content-Type': 'application/json',
            },
        });
    }
    
    
    // TODO implement
    const response = {
      statusCode: 200,
      body: JSON.stringify(`Health checker ran. Timestamp: ${new Date().toISOString()}`),
    };
    return response;
  };
  handler();