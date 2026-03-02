import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    if (params.id === 'uncategorized') {
      return NextResponse.json(
        { error: 'Cannot delete the default folder' },
        { status: 400 }
      );
    }

    const success = store.deleteFolder(params.id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Folder not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/folders/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete folder' },
      { status: 500 }
    );
  }
}