export default async function handler(req, res) {
  const allowedOrigins = [
  'https://argentilover.github.io',
  'https://technology-tracker.vercel.app',
  'https://vercel.com/danils-projects-e42892b9/technology-tracker',
  'https://technology-tracker-6ovqpe1ud-danils-projects-e42892b9.vercel.app'
];

const origin = req.headers.origin;
if (allowedOrigins.includes(origin)) {
  res.setHeader('Access-Control-Allow-Origin', origin);
}

  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://onecompiler.com/api/v1/languages');

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    
    return res.status(200).json(data);
    
  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to fetch programming languages'
    });
  }
}