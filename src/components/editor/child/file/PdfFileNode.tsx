import FileInfoIcon from '../../../../../public/svgs/editor/file-info.svg';

export type PdfFileNodeProps = {
    fileTitle: string;
    fileUrl: string;
}

export default function PdfFileNode({ fileTitle, fileUrl }: PdfFileNodeProps) {
    return (
        <a
            href={fileUrl}
            download={fileTitle}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px', // 아이콘과 텍스트 사이 간격
                color: 'inherit', // 링크 색상 상속
            }}>
            <FileInfoIcon width="20" style={{ verticalAlign: 'middle' }} />
            <div style={{ display: 'inline' }}>{fileTitle}</div>
        </a>
    );
}