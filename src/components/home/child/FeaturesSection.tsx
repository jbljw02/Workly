import CollaborationIcon from '../../../../public/svgs/home/collaboration.svg';
import PublishIcon from '../../../../public/svgs/home/publish.svg';
import SearchIcon from '../../../../public/svgs/home/search.svg';

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-6 bg-white rounded-lg">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 flex items-center justify-center">
                    {icon}
                </div>
                <h3 className="text-xl font-semibold">{title}</h3>
            </div>
            <p className="text-gray-600">{description}</p>
        </div>
    );
}

export default function FeaturesSection() {
    return (
        <section className="pb-20 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-row gap-8">
                    <FeatureCard
                        icon={<CollaborationIcon />}
                        title="실시간 협업"
                        description="팀원들과 실시간으로 문서를 편집하고 의견을 나눌 수 있습니다. 변경사항이 즉시 반영되어 효율적인 협업이 가능합니다." />
                    <FeatureCard
                        icon={<PublishIcon />}
                        title="웹 페이지 게시"
                        description="문서를 단 한 번의 클릭만으로 웹 페이지로 변환할 수 있습니다. 작성한 문서를 모두에게 공유해보세요."
                    />
                    <FeatureCard
                        icon={<SearchIcon />}
                        title="검색 & 즐겨찾기"
                        description="강력한 검색 기능으로 필요한 정보를 빠르게 찾고, 자주 사용하는 문서는 즐겨찾기로 쉽게 접근하세요."
                    />
                </div>
            </div>
        </section>
    );
}