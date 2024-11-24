import { NextRequest, NextResponse } from 'next/server';
import * as Y from 'yjs'
import axios from 'axios';

const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
const tiptapCloudSecret = process.env.NEXT_PUBLIC_TIPTAP_CLOUD_SECRET;

// tiptap cloud 서버에 문서 생성 - CREATE
export async function POST(req: NextRequest) {
  const { docName, docContent } = await req.json();

  if (!docName) return NextResponse.json({ error: '문서 이름이 필요합니다.' }, { status: 400 });

  try {
    const ydoc = new Y.Doc();

    // 초기 내용 설정
    // 전달된 내용이 있다면 해당 내용으로 문서 초기화, 없다면 빈 문서 생성
    const ytext = ydoc.getText('default');
    if (docContent) {
      ytext.insert(0, docContent);
    }
    else {
      ytext.insert(0, '');
    }

    // Y.Doc을 바이너리 업데이트로 인코딩
    const update = Y.encodeStateAsUpdate(ydoc);

    const response = await axios.post(
      `${wsUrl}/api/documents/${encodeURIComponent(docName)}`,
      update,
      {
        headers: {
          'Authorization': tiptapCloudSecret,
          'Content-Type': 'application/octet-stream' // 요청 본문이 바이너리 형식임을 명시
        },
      }
    );

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }
    else {
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
    const response = await axios.get(`${wsUrl}/api/documents/${docName}`, {
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
    console.log(error);
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: 'tiptap cloud 문서 삭제 실패' },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ error: 'tiptap cloud 문서 삭제 실패' }, { status: 500 });
  }
}
