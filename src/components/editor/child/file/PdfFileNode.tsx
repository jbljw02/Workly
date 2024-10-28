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
            className='flex items-center gap-1'>
            <FileInfoIcon width="20" style={{ verticalAlign: 'middle' }} />
            <div style={{ display: 'inline' }}>{fileTitle}</div>
        </a>
    );
}