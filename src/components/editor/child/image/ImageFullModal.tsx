import FileFullModal from "@/components/modal/FileFullModal";
import { setOpenFullModal } from "@/redux/features/editorImageSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ResizableImageNodeViewRendererProps } from "tiptap-extension-resizable-image";

type ImageFullModalProps = {
    resizableImgProps: ResizableImageNodeViewRendererProps;
}

export default function ImageFullModal({ resizableImgProps }: ImageFullModalProps) {
    const dispatch = useAppDispatch();
    const openFullModal = useAppSelector(state => state.openFullModal);
    console.log('resizableImgProps : ', resizableImgProps.node)
    return (
        <FileFullModal
            isModalOpen={openFullModal}
            setIsModalOpen={() => dispatch(setOpenFullModal(false))}
            href={resizableImgProps.node.attrs.src}
            download={resizableImgProps.node.attrs.title || ''}>
            <img
                className='border-none rounded-sm'
                src={resizableImgProps.node.attrs.src}
                style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                }} />
        </FileFullModal>
    )
}