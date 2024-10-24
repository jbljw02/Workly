import { Editor } from '@tiptap/react'
import ReactDOMServer from 'react-dom/server';
import PdfFileNode from '@/components/editor/child/file/PdfFileNode'


// 에디터 내용을 PDF로 변환하고 다운로드하는 함수
const downloadPDF = async (editor: Editor, docTitle: string) => {
    try {
        // 에디터의 HTML 콘텐츠 가져오기
        let content = editor.getHTML();

        // 에디터에서 가져온 HTML을 임시 div에 파싱
        const container = document.createElement('div');
        container.innerHTML = content;

        // 모든 파일 노드를 찾음
        const fileNodes = container.querySelectorAll('[data-file]');

        fileNodes.forEach((node) => {
            // 파일명을 가져오고, 링크를 생성할 URL을 가져옴
            const filename = node.getAttribute('title') || '알 수 없는 파일';
            const fileUrl = node.getAttribute('href') || ''; // 파일의 URL을 가져옴 (미리 업로드되어 있다고 가정)

            // 컴포넌트를 HTML로 변환
            const pdfFileNodeHtml = ReactDOMServer.renderToString(
                <PdfFileNode fileTitle={filename} fileUrl={fileUrl} />
            );

            // 파일 노드를 새로운 HTML로 교체
            const replacementNode = document.createElement('div');
            replacementNode.innerHTML = pdfFileNodeHtml;

            // 기존 파일 노드를 새로운 노드로 교체
            node.parentNode?.replaceChild(replacementNode, node);
        });

        // 변경된 HTML 콘텐츠를 문자열로 변환
        content = container.innerHTML;

        const response = await fetch('/api/export-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: content, // 변경된 HTML 콘텐츠
                title: docTitle || '제목 없는 문서',
            }),
        });

        if (!response.ok) {
            throw new Error('PDF 생성에 실패했습니다.');
        }

        // blod = Binary Large Obejct
        // 파일, 이미지, 비디오 등을 이진 형식으로 저장하고 조작할 수 있도록 도와줌
        const pdfBlob = await response.blob();

        // PDF 다운로드를 위한 링크 생성
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${docTitle || '제목 없는 문서'}.pdf`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error('PDF 다운로드 중 오류 발생:', error);
    }
};

export default downloadPDF;