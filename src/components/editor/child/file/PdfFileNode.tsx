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
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                backgroundColor: '#f3f4f6',
                textDecoration: 'none',
                color: 'inherit',
            }}>
            <FileInfoIcon
                width="20"
                style={{ verticalAlign: 'middle' }} />
            <span
                style={{
                    display: 'inline',
                    verticalAlign: 'middle',
                    paddingTop: '2px'
                }}>
                {fileTitle}
            </span>
        </a>
    );
}