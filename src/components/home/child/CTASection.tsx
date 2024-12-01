import CommonButton from "@/components/button/CommonButton";
import Link from "next/link";

export default function CTASection() {
    return (
        <section className="py-24 bg-gray-50 relative">
            <div className="max-w-4xl mx-auto text-center px-4">
                <div className="space-y-2">
                    <h2 className="text-4xl font-bold text-gray-900">
                        지금 바로 시작하세요
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        튜토리얼은 필요 없습니다. 지금 바로 시작하세요.
                    </p>
                    <div className="pt-5">
                        <Link href="/signup">
                            <CommonButton
                                style={{
                                    width: 'w-60',
                                    height: 'h-[68px]',
                                    textSize: 'text-xl',
                                    textColor: 'text-white',
                                    bgColor: 'bg-black',
                                    hover: 'hover:scale-105'
                                }}
                                label="Workly 시작하기" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}