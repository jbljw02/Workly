import UseCaseItem, { UseCase } from './UseCaseItem';
import RealTimeAuthorityIcon from '../../../../public/svgs/home/animate/real-time-authority.svg';
import PublishIcon from '../../../../public/svgs/home/animate/publish.svg';
import LinkShareIcon from '../../../../public/svgs/home/animate/link-share.svg';
import LastReadIcon from '../../../../public/svgs/home/animate/last-read.svg';
import ShortcutsIcon from '../../../../public/svgs/shortcuts-on.svg';

export default function UseCaseSection() {
    const useCases: UseCase[] = [
        {
            title: "실시간 협업",
            description: "문서를 다른 사용자에게 공유하고, 함께 편집하세요.\n텍스트, 이미지, 파일, 모든 것이 실시간으로 공유됩니다.",
            features: [
                "실시간 문서 동기화",
                "권한에 따른 편집 수준 관리"
            ],
            statusButtons: [
                {
                    icon: <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />,
                    text: "실시간 동시 편집",
                },
                {
                    icon: <RealTimeAuthorityIcon
                        width={16}
                        height={16}
                        className="text-blue-500 animate-pulse" />,
                    text: "실시간 권한 관리",
                }
            ],
            image: {
                src: "/pngs/collaboration.png",
                alt: "team-document"
            },
            imagePosition: "left"
        },
        {
            title: "문서 게시",
            description: "문서를 단 한 번의 클릭만으로 웹 페이지로 변환하여 공유할 수 있습니다.\n전세계 모든 사람에게 문서를 공유해보세요.",
            features: [
                "간편한 문서 게시",
                "읽기 전용 문서 공유"
            ],
            statusButtons: [
                {
                    icon: <PublishIcon
                        width={16}
                        height={16}
                        className="text-green-500 animate-pulse" />,
                    text: "웹 페이지 게시",
                },
                {
                    icon: <LinkShareIcon
                        width={16}
                        height={16}
                        className="text-blue-500 animate-pulse" />,
                    text: "링크 공유",
                }
            ],
            image: {
                src: "/pngs/published.png",
                alt: "published-document"
            },
            imagePosition: "right"
        },
        {
            title: "체계적인 문서 관리",
            description: "문서를 폴더별로 구조화하고,\n문서의 상태에 따라서 체계적으로 관리할 수 있습니다.",
            features: [
                "폴더 기반 문서 구조화",
                "상태별 문서 관리"
            ],
            statusButtons: [
                {
                    icon: <LastReadIcon
                        width={16}
                        height={16}
                        className="text-green-500 animate-pulse" />,
                    text: "최근 열람 시간 표시",
                },
                {
                    icon: <ShortcutsIcon
                        width={16}
                        height={16}
                        className="text-blue-500 animate-pulse" />,
                    text: "즐겨찾기",
                }
            ],
            image: {
                src: "/pngs/list.png",
                alt: "document-list"
            },
            imagePosition: "left"
        }
    ];

    return (
        <section className="pt-16 pb-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10">
                    <h2 className="text-6xl font-bold text-left mb-4">
                        복잡한 매뉴얼은 잊으세요.
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl">
                        복잡한 기능, 불필요한 기능은 전부 빼고 꼭 필요한 것만 담았습니다. <br />
                        Workly가 처음이신가요? 5분이면 충분합니다.
                    </p>
                </div>
                {
                    // 사용 사례(방법)를 나열
                    useCases.map((useCase, index) => (
                        <UseCaseItem
                            key={index}
                            useCase={useCase} />
                    ))
                }
            </div>
        </section>
    );
}