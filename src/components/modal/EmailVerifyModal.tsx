import { ModalProps } from '@/types/modalProps';
import { useState } from 'react';
import Modal from 'react-modal';

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
                    width: 500,
                    height: 205,
                    transform: 'translate(-50%, -50%)',
                }
            }}
        >
            <div className="pop-up-container">
                {
                    isVerify ?
                        <div className="pop-up-title-section">
                            이메일로 인증 메일을 전송했습니다.
                        </div> :
                        <div className="pop-up-title-section" style={{ color: '#FF0000' }}>
                            인증이 아직 완료되지 않았습니다!
                        </div>
                }
                {
                    isVerify ?
                        <div className="pop-up-subtitle-section">
                            메일 본문에 있는 인증 절차를 마치시면 계정이 활성화됩니다. <br />
                            완료하셨다면 &apos;확인&apos;을 클릭해주시고, 메일을 받지 못하셨다면 &apos;재전송&apos;을 클릭해주세요.
                        </div> :
                        <div className='pop-up-subtitle-section' style={{ color: '#111111' }}>
                            메일 본문에 있는 인증 절차를 마치시면 계정이 활성화됩니다. <br />
                            메일을 받지 못하셨다면 &apos;재전송&apos;을 클릭해주시고, 그럼에도 받지 못하셨다면 스팸 메일함을 확인해주세요.
                        </div>
                }
                <div className="pop-up-btn-section">
                    <div
                        className={`${isVibrate ? 'read-btn vibrate' : 'read-btn'}`}>
                        확인
                    </div>
                    <div
                        className="close-btn">
                        재전송
                    </div>
                </div>
            </div>
        </Modal>
    )
}