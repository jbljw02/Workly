import PublishIcon from '../../../../public/svgs/publish.svg';

export default function PublishContent() {
    return (
        <div className='flex flex-col items-center justify-center h-auto pb-8'>
            <PublishIcon width="100" />
            <div className='font-semibold mt-4 mb-2 text-[17px]'>웹 페이지로 게시</div>
            <div className='text-sm text-neutral-600 text-center'>
                현재 문서로 웹 사이트를 생성합니다.
                <br />
                웹 사이트는 읽기 전용으로 생성되며, 누구나 접근할 수 있습니다.
            </div>
        </div>
    )
}