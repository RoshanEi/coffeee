// This file is a placeholder for Netlify Functions
// It helps ensure the netlify/functions directory exists
// which can help with Netlify's detection of Next.js projects

exports.handler = async function() {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Next.js build helper" })
  };
}; 