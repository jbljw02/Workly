import Image from "next/image";
import CheckIcon from '../../../../public/svgs/home/check.svg';

export type UseCase = {
    title: string;
    description: string;
    features: string[];
    statusButtons: {
        icon: React.ReactNode;
        text: string;
    }[];
    image: {
        src: string;
        alt: string;
    };
    imagePosition: 'left' | 'right';
}

type UseCaseItemProps = {
    useCase: UseCase;
}

export default function UseCaseItem({ useCase }: UseCaseItemProps) {
    const { title, description, features, statusButtons, image, imagePosition } = useCase;

    // 사용 사례(방법) 컨텐츠
    const ContentSection = (
        <div className="flex flex-col w-[385px] space-y-6">
            {/* 제목 */}
            <h3 className="text-3xl font-bold">{title}</h3>
            {/* 설명 */}
            <p className="text-lg text-gray-600 leading-relaxed">{description}</p>
            {/* 특징 */}
            <ul className="space-y-3 px-0">
                {
                    features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                            <CheckIcon />
                            <span>{feature}</span>
                        </li>
                    ))
                }
            </ul>
            {/* 애니메이션 버튼(non-clickable) */}
            <div className="flex items-center gap-3 mt-6">
                {
                    statusButtons.map((button, index) => (
                        <div key={index} className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
                            {button.icon}
                            <span className="text-sm text-gray-600">{button.text}</span>
                        </div>
                    ))
                }
            </div>
        </div>
    );

    // 이미지 섹션
    const ImageSection = (
        <div className='flex-1'>
            <div className='border border-gray-300 rounded-lg overflow-hidden shadow-lg'>
                <Image
                    src={image.src}
                    alt={image.alt}
                    width={1600}
                    height={1600}
                    className="w-full h-auto object-cover"
                    priority />
            </div>
        </div >
    );

    return (
        <div className="flex items-center gap-16 mb-24">
            {
                imagePosition === 'left' ? (
                    <>
                        {ImageSection}
                        {ContentSection}
                    </>
                ) : (
                    <>
                        {ContentSection}
                        {ImageSection}
                    </>
                )
            }
        </div>
    );
}