import { ModalProps } from '@/types/modalProps';
import { useState } from 'react';
import Modal from 'react-modal';
import CommonButton from '../button/CommonButton';

export default function EmailVerifyModal({ isModalOpen, setIsModalOpen }: ModalProps) {
    const [isVerify, setIsVerify] = useState<boolean>(true); // 이메일이 인증됐는지
    const [isVibrate, setIsVibrate] = useState<boolean>(false); // 진동 효과를 줄지

    return (
        <Modal
            isOpen={isModalOpen}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                },
                content: {
                    position: 'absolute',
                    left: '50%',
                    top: '45%',
                    width: 540,
                    height: 250,
                    paddingTop: 35,
                    paddingBottom: 35,
                    paddingLeft: 40,
                    paddingRight: 40,
                    transform: 'translate(-50%, -50%)',
                }
            }}>
            <div className="flex flex-col justify-center items-center text-center gap-3">
                {
                    isVerify ?
                        <div className="text-lg font-medium">
                            이메일로 인증 메일을 전송했습니다.
                        </div> :
                        <div className="text-lg text-red-500" style={{ color: '#FF0000' }}>
                            인증이 아직 완료되지 않았습니다!
                        </div>
                }
                <div className="text-[15px] text-zinc-600">
                    {
                        isVerify ?
                            <>
                                메일 본문에 있는 인증 절차를 마치시면 계정이 활성화됩니다. <br />
                                완료하셨다면 &apos;확인&apos;을 클릭해주시고, 메일을 받지 못하셨다면 &apos;재전송&apos;을 클릭해주세요.
                            </> :
                            <>
                                메일 본문에 있는 인증 절차를 마치시면 계정이 활성화됩니다. <br />
                                메일을 받지 못하셨다면 &apos;재전송&apos;을 클릭해주시고, 그럼에도 받지 못하셨다면 스팸 메일함을 확인해주세요.
                            </>

                    }
                </div>
                <div className="flex flex-row items-center justify-center gap-5 mt-5">
                    <CommonButton
                        style={{
                            px: 'px-[91px]',
                            py: 'py-2.5',
                            textSize: 'text-base',
                            textColor: 'text-white',
                            bgColor: 'bg-black',
                            hover: 'hover:bg-zinc-800'
                        }}
                        label="확인"
                        onClick={() => {
                            setIsModalOpen(false)
                        }} />
                    <CommonButton
                        style={{
                            px: 'px-[91px]',
                            py: 'py-2.5',
                            textSize: 'text-base',
                            textColor: 'text-black',
                            bgColor: 'bg-white',
                            hover: 'hover:bg-gray-100'
                        }}
                        label="재전송"
                        onClick={() => setIsModalOpen(false)} />
                </div>
            </div>
        </Modal>
    )
}