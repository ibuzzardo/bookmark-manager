import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { createBookmarkSchema } from '@/lib/validators';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder');
    const tag = searchParams.get('tag');
    const query = searchParams.get('q');

    const bookmarks = store.searchBookmarks(
      query || '',
      folder || undefined,
      tag || undefined
    );

    return NextResponse.json({ bookmarks });
  } catch (error) {
    console.error('GET /api/bookmarks error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookmarks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validatedData = createBookmarkSchema.parse(body);

    // Check for duplicate URL
    const existingBookmarks = store.getBookmarks();
    const duplicate = existingBookmarks.find(b => b.url === validatedData.url);
    if (duplicate) {
      return NextResponse.json(
        { error: 'A bookmark with this URL already exists' },
        { status: 409 }
      );
    }

    const bookmark = store.addBookmark(validatedData);
    return NextResponse.json({ bookmark }, { status: 201 });
  } catch (error) {
    console.error('POST /api/bookmarks error:', error);
    
    if (error instanceof Error && 'issues' in error) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create bookmark' },
      { status: 500 }
    );
  }
}