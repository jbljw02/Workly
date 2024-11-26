import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
const tiptapCloudSecret = process.env.NEXT_PUBLIC_TIPTAP_CLOUD_SECRET;

// tiptap cloud 서버에 문서 생성 - CREATE
export async function POST(req: NextRequest) {
  const { docName, docContent } = await req.json();

  if (!docName) return NextResponse.json({ error: '문서 이름이 필요합니다.' }, { status: 400 });

  try {
    // 빈 문서의 기본 구조 정의
    const emptyDocument = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          attrs: { textAlign: 'left' }
        }
      ]
    };

    // docContent가 null이면 빈 문서 구조 사용
    const documentContent = docContent || emptyDocument;

    const response = await axios.post(
      `${wsUrl}/api/documents/${encodeURIComponent(docName)}?format=json`,
      documentContent,
      {
        headers: {
          'Authorization': tiptapCloudSecret,
          'Content-Type': 'application/json'
        },
      }
    );

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    } else {
      return NextResponse.json({ error: '예상치 못한 응답' }, { status: response.status });
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      return NextResponse.json({ error: '이미 존재하는 문서' }, { status: 409 });
    }
    return NextResponse.json({ error: 'tiptap cloud 문서 생성 실패' }, { status: 500 });
  }
}

// tiptap cloud 서버에서 문서 내용 가져오기 - READ
export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = req.nextUrl;
  const docName = searchParams.get('docName');

  try {
    const response = await axios.get(`${wsUrl}/api/documents/${docName}?format=yjs`, {
      headers: {
        Authorization: tiptapCloudSecret,
      },
      responseType: 'json',
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'tiptap cloud 문서 내용 가져오기 실패' }, { status: 500 });
  }
}

// tiptap cloud 서버에서 문서 삭제 - DELETE
export async function DELETE(req: NextRequest, res: NextResponse) {
  const { searchParams } = req.nextUrl;
  const docName = searchParams.get('docName');

  try {
    const response = await axios.delete(`${wsUrl}/api/documents/${docName}`, {
      headers: {
        Authorization: tiptapCloudSecret,
      },
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // 404 에러는 문서가 이미 없는 상태이므로 성공으로 처리
      if (error.response?.status === 404) {
        return NextResponse.json({ success: "문서가 이미 삭제됨" }, { status: 200 });
      }
      return NextResponse.json(
        { error: 'tiptap cloud 문서 삭제 실패' },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ error: 'tiptap cloud 문서 삭제 실패' }, { status: 500 });
  }
}
