import { ModalProps } from "@/types/modalProps";
import { useState } from "react";
import Modal from "react-modal";
import Image from "next/image";
import FormInput from "../input/FormInput";
import SubmitButton from "../button/SubmitButton";
import CommonButton from "../button/CommonButton";
import { useAppSelector } from "@/redux/hooks";

export default function AccountModal({ isModalOpen, setIsModalOpen }: ModalProps) {
    const user = useAppSelector(state => state.user.user);
    const [formData, setFormData] = useState({
        name: user.displayName,
    });
    const formChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    return (
        <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            style={{
                overlay: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 500,
                },
                content: {
                    position: 'absolute',
                    left: '50%',
                    top: '45%',
                    width: 500,
                    height: 240,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 501,
                    padding: 0,
                }
            }}>
            <div className="flex w-full min-h-screen items-center justify-center">
                <div className="flex flex-col w-[480px] h-full items-center justify-center mb-7 gap-8">
                    <div className="w-20 h-20 mb-1">
                        <Image
                            src={user.photoURL === 'unknown-user' ? '/svgs/add-user.svg' : user.photoURL}
                            alt={user.displayName}
                            width={80}
                            height={80}
                            className="rounded-full" />
                    </div>
                    <form className="flex flex-col gap-4 w-full pb-10 border-b">
                        <FormInput
                            type="text"
                            name="name"
                            value={formData.name}
                            setValue={formChange}
                            placeholder='이름'
                            autoFocus={true} />
                        <div className="w-full rounded border px-3 py-2.5 bg-gray-200 text-gray-400">
                            <input
                                type="email"
                                name="email"
                                value={user.email}
                                readOnly={true}
                                className="border-none text-[15px] outline-none bg-transparent w-full" />
                        </div>
                        <SubmitButton
                            style={{
                                width: 'w-full',
                                height: 'h-[52px]',
                                textSize: 'text-base',
                                textColor: 'text-white',
                                bgColor: 'bg-blue-500',
                                hover: 'hover:bg-blue-700'
                            }}
                            label="변경하기"
                            value={formData.name && formData.name !== user.displayName} />
                    </form>
                    <div className="flex flex-row gap-4 w-full pt-3">
                        <CommonButton
                            style={{
                                width: 'w-1/2',
                                height: 'h-[55px]',
                                textSize: 'text-base',
                                textColor: 'text-black',
                                bgColor: 'bg-white',
                                hover: 'hover:border-gray-500'
                            }}
                            label="회원 탈퇴" />
                        <CommonButton
                            style={{
                                width: 'w-1/2',
                                height: 'h-[55px]',
                                textSize: 'text-base',
                                textColor: 'text-white',
                                bgColor: 'bg-black',
                                hover: 'hover:bg-zinc-800'
                            }}
                            label="로그아웃" />
                    </div>
                </div>
            </div>
        </Modal>
    )
}