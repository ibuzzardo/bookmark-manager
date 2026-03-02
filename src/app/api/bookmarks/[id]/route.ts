import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { updateBookmarkSchema } from '@/lib/validators';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validatedData = updateBookmarkSchema.parse(body);
    
    const bookmark = store.updateBookmark(params.id, validatedData);
    
    if (!bookmark) {
      return NextResponse.json(
        { error: 'Bookmark not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ bookmark });
  } catch (error) {
    console.error('PUT /api/bookmarks/[id] error:', error);
    
    if (error instanceof Error && 'issues' in error) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update bookmark' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const success = store.deleteBookmark(params.id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Bookmark not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/bookmarks/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete bookmark' },
      { status: 500 }
    );
  }
}