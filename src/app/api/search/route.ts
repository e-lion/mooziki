import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get('term');
  const limit = searchParams.get('limit') || '8';
  
  if (!term) {
    return NextResponse.json({ results: [] });
  }

  try {
    const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('iTunes API responded with an error');
    }
    
    // The iTunes API sends content-type text/javascript. It is valid JSON.
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching from iTunes API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch songs', results: [] }, 
      { status: 500 }
    );
  }
}
