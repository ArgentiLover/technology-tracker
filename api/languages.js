export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://argentilover.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Для preflight запроса
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('Fetching languages from OneCompiler...');
    const response = await fetch('https://onecompiler.com/api/v1/languages');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Successfully fetched ${data.length} languages`);
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch languages',
      message: error.message 
    });
  }
}