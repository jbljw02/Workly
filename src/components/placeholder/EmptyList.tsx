import EmptyFolderIcon from '../../../public/svgs/empty-folder.svg';
import EmptyTrashIcon from '../../../public/svgs/empty-trash.svg';

type EmptyListProps = {
    type: 'document' | 'trash';
    textSize: 'sm' | 'lg';
    iconWidth: string;
    description: string;
}

export default function EmptyList({ type, textSize, iconWidth, description }: EmptyListProps) {
    return (
        <div className="flex flex-row items-center justify-center w-full h-full text-neutral-500 gap-[14px] pb-10">
            {
                type === 'document' ?
                    <EmptyFolderIcon width={iconWidth} /> :
                    <EmptyTrashIcon width={iconWidth} />
            }
            <div className={`text-${textSize}`}>  {description}</div>
        </div>
    )
}