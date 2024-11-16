import Modal from 'react-modal';
import CloseIcon from '../../../public/svgs/close.svg';
import CommonButton from './CommonButton';

interface modalProps {
    isModalOpen: boolean,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setIsAgree: React.Dispatch<React.SetStateAction<boolean>>,
    category: string,
}

export default function PINoticeModal({ isModalOpen, setIsModalOpen, setIsAgree, category }: modalProps) {
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
                    top: '50%',
                    width: 600,
                    height: category === '문의' ? 845 : 750,
                    padding: 40,
                    transform: 'translate(-50%, -50%)',
                    overflow: 'hidden'
                }
            }}>
            <div className='flex flex-col p-2 gap-4'>
                <button
                    onClick={() => setIsModalOpen(false)}
                    className='absolute top-6 right-6'>
                    <CloseIcon
                        className="hover:text-gray-500"
                        width="25" />
                </button>
                <div className="flex flex-row justify-between">
                    <div className="text-2xl font-bold">개인정보 처리방침</div>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="text-lg font-bold mt-3">1. 개인정보 수집 이용에 대한 동의</div>
                    <div className="text-[15px]">
                        귀하의 개인정보는 아래의 방침에 따라 수집 및 이용됩니다. <br />
                        Workly는 필요한 최소한의 개인정보만을 수집하며, 수집된 개인정보는 철저한 보호와 관리를 통해 취급될 것임을 약속드립니다. <br />
                        이에 따라, 개인정보의 수집 및 활용에 관한 귀하의 동의를 요청드립니다.
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="text-lg font-bold mt-3">2. 개인정보의 수집 목적</div>
                    {
                        category === '문의' ?
                            <>
                                귀하의 문의에 대한 답변을 드리기 위해 개인정보가 수집됩니다.
                            </> :
                            <>
                                귀하를 Workly의 회원으로서 관리하기 위해 개인정보가 수집됩니다.
                            </>
                    }
                </div>
                <div className="flex flex-col gap-1">
                    <div className="text-lg font-bold mt-3">3. 개인정보의 수집 항목</div>
                    {
                        category === '문의' ?
                            <>
                                필수항목: 성명, 이메일, 문의내용 <br />
                                선택항목: 연락처
                            </> :
                            <>
                                필수항목: 성명, 이메일, 비밀번호 <br />
                            </>
                    }
                </div>
                <div className="flex flex-col gap-1">
                    <div className="text-lg font-bold mt-3">4. 개인정보의 보존 기간</div>
                    {
                        category === '문의' ?
                            <>
                                보존기간: 문의사항 처리시까지 <br />
                                개인정보 수집 목적이 달성된 후에는 해당 정보를 즉시 파기합니다.
                            </> :
                            <>
                                보존기간: 회원 탈퇴 전까지 <br />
                                회원 탈퇴 후에는 개인 정보를 즉시 파기합니다.
                            </>
                    }
                </div>
                <div className="flex flex-col gap-1">
                    <div className="text-lg font-bold mt-3">5. 개인정보 수집을 거부할 수 있는 권리 및 거부 시의 영향</div>
                    {
                        category === '문의' ?
                            <>
                                문의 처리를 위해 필수적인 개인정보의 수집 및 이용에 대한 동의는 필수입니다. 이에 동의하지 않으시면, 문의에 대한 처리를 받으실 수 없습니다.  <br />
                                선택항목에 대한 수집 및 이용에 관해서는 동의를 거부할 권리가 있습니다. 선택항목에 대한 정보를 제공하지 않으시면, 해당 정보의 수집 및 이용에 관해서는 동의하지 않은 것으로 간주됩니다.
                            </> :
                            <>
                                회원가입을 위해 필수적인 개인정보의 수집 및 이용에 대한 동의는 필수입니다. 이에 동의하지 않으시면, 회원가입이 불가능합니다.  <br />
                            </>
                    }
                </div>
                <div className='flex flex-row items-center justify-center gap-5 mt-8'>
                    <CommonButton
                        style={{
                            width: 'w-full',
                            height: 'h-12',
                            textSize: 'text-base',
                            textColor: 'text-white',
                            bgColor: 'bg-black',
                            hover: 'hover:bg-zinc-800'
                        }}
                        label="동의"
                        onClick={() => {
                            setIsModalOpen(false)
                            setIsAgree(true);
                        }} />
                    <CommonButton
                        style={{
                            width: 'w-full',
                            height: 'h-12',
                            textSize: 'text-base',
                            textColor: 'text-black',
                            bgColor: 'bg-white',
                            hover: 'hover:bg-gray-100'
                        }}
                        label="거부"
                        onClick={() => setIsModalOpen(false)} />
                </div>
            </div>
        </Modal>
    )
}