import { useAppDispatch } from "@/redux/hooks";
import CommonButton from "@/components/button/CommonButton";
import { useState } from "react";
import WithdrawlModal from "@/components/modal/WithdrawlModal";
import logout from "@/utils/auth/logout";

export default function AccountFooter() {
    const dispatch = useAppDispatch();

    const [isWithdrawlModalOpen, setIsWithdrawlModalOpen] = useState(false);
    return (
        <>
            <WithdrawlModal
                isModalOpen={isWithdrawlModalOpen}
                setIsModalOpen={setIsWithdrawlModalOpen} />
            <div className="flex flex-row gap-4">
                <CommonButton
                    style={{
                        width: 'w-1/2',
                        height: 'h-[52px]',
                        textSize: 'text-base',
                        textColor: 'text-red-600',
                        bgColor: 'bg-red-50',
                        hover: 'hover:border-red-400',
                        borderColor: 'border-red-50'
                    }}
                    label="탈퇴하기"
                    onClick={() => setIsWithdrawlModalOpen(true)} />
                <CommonButton
                    style={{
                        width: 'w-1/2',
                        height: 'h-[52px]',
                        textSize: 'text-base',
                        textColor: 'text-black',
                        bgColor: 'bg-white',
                        hover: 'hover:border-gray-500'
                    }}
                    label="로그아웃"
                    onClick={() => logout(dispatch)} />
            </div>
        </>
    )
}