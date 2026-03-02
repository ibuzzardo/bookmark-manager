import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { createFolderSchema } from '@/lib/validators';

export async function GET(): Promise<NextResponse> {
  try {
    const folders = store.getFolders();
    return NextResponse.json({ folders });
  } catch (error) {
    console.error('GET /api/folders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch folders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validatedData = createFolderSchema.parse(body);

    // Check for duplicate folder name
    const existingFolders = store.getFolders();
    const duplicate = existingFolders.find(f => f.name.toLowerCase() === validatedData.name.toLowerCase());
    if (duplicate) {
      return NextResponse.json(
        { error: 'A folder with this name already exists' },
        { status: 409 }
      );
    }

    const folder = store.addFolder(validatedData);
    return NextResponse.json({ folder }, { status: 201 });
  } catch (error) {
    console.error('POST /api/folders error:', error);
    
    if (error instanceof Error && 'issues' in error) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create folder' },
      { status: 500 }
    );
  }
}