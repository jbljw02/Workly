import { useAppSelector } from "@/redux/hooks";

export default function EditorHomeHeader() {
    const user = useAppSelector(state => state.user);
    return (
        <header className="flex flex-row justify-between items-center pt-10 px-12 pb-6 mb-5 gap-2">
            <div className="flex flex-col items-start gap-2">
                <div className="text-3xl font-semibold">{user.displayName}님, 안녕하세요.</div>
                <div className="pl-0.5 text-sm text-neutral-500">오늘은 무엇을 작성하시겠어요?</div>
            </div>
        </header>
    )
}