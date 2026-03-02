import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET(): Promise<NextResponse> {
  try {
    const tags = store.getTags();
    return NextResponse.json({ tags });
  } catch (error) {
    console.error('GET /api/tags error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}