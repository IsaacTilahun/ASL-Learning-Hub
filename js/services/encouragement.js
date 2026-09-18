import { ENCOURAGEMENT_API } from '../config.js';

// Optional: an LLM-written progress message. Disabled unless a key is present
// in localStorage, since a static site cannot keep one secret.
function getApiKey() {
  try {
    return localStorage.getItem(ENCOURAGEMENT_API.apiKeyStorageKey);
  } catch {
    return null;
  }
}

function localMessage(learnedCount) {
  return learnedCount === 0
    ? 'Pick a mode and make your first sign — you have got this! 🤟'
    : `Amazing! You have learned ${learnedCount} signs! Keep it up! 🎉`;
}

/**
 * Fetch an encouraging one-liner, falling back to a local message if the API is
 * unconfigured or unreachable.
 * @returns {Promise<string>}
 */
export async function getEncouragement(alphabetCount, numberCount) {
  const learnedCount = alphabetCount + numberCount;
  const apiKey = getApiKey();
  if (!apiKey) return localMessage(learnedCount);

  const prompt =
    `You are an encouraging ASL teacher. The student has learned ${alphabetCount} of 26 ` +
    `alphabet signs and ${numberCount} of 10 number signs. Write one short, genuine, ` +
    'motivating line under 50 words praising their progress.';

  try {
    const response = await fetch(ENCOURAGEMENT_API.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: ENCOURAGEMENT_API.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: ENCOURAGEMENT_API.maxTokens
      })
    });

    if (!response.ok) return localMessage(learnedCount);

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || localMessage(learnedCount);
  } catch {
    return localMessage(learnedCount);
  }
}
