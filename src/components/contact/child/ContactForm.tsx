import { emailRegex } from "@/components/auth/SignUp";
import PINoticeModal from "@/components/button/PINoticeModal";
import SubmitButton from "@/components/button/SubmitButton";
import FormInput from "@/components/input/FormInput";
import PIAgreeCheckbox from "@/components/input/PIAgreeCheckbox";
import { showCompleteAlert, showWarningAlert } from "@/redux/features/alertSlice";
import { setWorkingSpinner } from "@/redux/features/placeholderSlice";
import { useAppDispatch } from "@/redux/hooks";
import axios from "axios";
import { useState } from "react";

function InputLabel({ label, isRequired }: { label: string, isRequired: boolean }) {
    return (
        <label className="text-sm font-medium pl-0.5">
            {label}
            {isRequired && <span className="text-red-500">*</span>}
        </label>
    )
}

export default function ContactForm() {
    const dispatch = useAppDispatch();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        isAgreeForPersonalInfo: false,
        isSubmitted: false
    });

    // 개인정보 처리방침에 동의하지 않았을 때의 진동 효과
    const [isVibrate, setIsVibrate] = useState(false);
    const [isPIModalOpen, setIsPIModalOpen] = useState(false);

    const [emailInvalid, setEmailInvalid] = useState({
        isInvalid: false,
        msg: '유효하지 않은 이메일입니다',
    });

    const formChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        // 이메일 유효성 검사
        if (name === 'email' && formData.isSubmitted) {
            if (!emailRegex.test(value)) {
                setEmailInvalid({
                    msg: '유효하지 않은 이메일입니다',
                    isInvalid: true,
                });
            }
            else {
                setEmailInvalid({
                    msg: '',
                    isInvalid: false,
                });
            }
        }
    };

    const sendEmail = async () => {
        try {
            dispatch(setWorkingSpinner(true));
            await axios.post('/api/send-email', {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                message: formData.message,
            });
            dispatch(showCompleteAlert('이메일 전송에 성공했습니다.'));
        } catch (error) {
            dispatch(showWarningAlert('이메일 전송에 실패했습니다.'));
        } finally {
            dispatch(setWorkingSpinner(false));
        }
    }

    const formSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault(); // form의 기본 동작을 막음(조건이 만족해야 전송되도록)

        // 제출 여부 true
        setFormData((prevState) => ({
            ...prevState,
            isSubmitted: true,
        }));

        // 이메일이 정규식을 따르지 않을 경우
        if (!emailRegex.test(formData.email)) {
            setEmailInvalid({
                msg: '유효하지 않은 이메일입니다',
                isInvalid: true,
            });
            
            return;
        }

        // 개인정보 처리방침에 동의하지 않았을 경우 진동 효과
        if (!formData.isAgreeForPersonalInfo) {
            setIsVibrate(true);
            setTimeout(() => {
                setIsVibrate(false);
            }, 1000);

            return;
        }

        /* 
            1. 공란이 없어야 함
            2. 비밀번호와 비밀번호 확인란이 일치해야 함
            3. 개인정보 처리방침에 동의해야 함
            4. 이메일과 비밀번호가 정규식을 따라야 함
            5. 이메일이 이미 존재하지 않아야 함
        */
        if (formData.name &&
            formData.email &&
            formData.isAgreeForPersonalInfo &&
            !emailInvalid.isInvalid) {
            sendEmail();
        }
    }

    // 개인정보 처리방침 동의 토글
    const toggleCheckbox = () => {
        setFormData((prevState) => ({
            ...prevState,
            isAgreeForPersonalInfo: !prevState.isAgreeForPersonalInfo,
        }));
    }

    console.log('pimodal', isPIModalOpen);

    return (
        <form
            onSubmit={formSubmit}
            className="space-y-6"
            noValidate>
            <div className="space-y-1">
                <InputLabel label="이름" isRequired={true} />
                <FormInput
                    type="text"
                    name="name"
                    value={formData.name}
                    setValue={formChange}
                    placeholder="홍길동" />
            </div>
            <div className="space-y-1">
                <InputLabel label="이메일" isRequired={true} />
                <FormInput
                    type="email"
                    name="email"
                    value={formData.email}
                    setValue={formChange}
                    placeholder="workly@gmail.com"
                    isInvalidInfo={emailInvalid} />
            </div>
            <div className="space-y-1">
                <InputLabel label="연락처" isRequired={false} />
                <FormInput
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    setValue={formChange}
                    placeholder="010-1234-5678" />
            </div>
            <div className="space-y-3">
                <div className="space-y-1">
                    <InputLabel label="문의 내용" isRequired={true} />
                    <textarea
                        required
                        name="message"
                        rows={4}
                        className="w-full rounded border border-gray-300 px-3 py-2 bg-gray-50 focus-within:border-gray-600 focus:outline-none"
                        value={formData.message}
                        onChange={formChange}
                        placeholder="Workly에 대한 문의사항을 작성해주세요." />
                </div>
                <PIAgreeCheckbox
                    formData={formData}
                    onChange={toggleCheckbox}
                    isVibrate={isVibrate}
                    setIsPIModalOpen={setIsPIModalOpen} />
                <PINoticeModal
                    isModalOpen={isPIModalOpen}
                    setIsModalOpen={setIsPIModalOpen}
                    setIsAgree={(agree) => setFormData((prevState) => ({
                        ...prevState,
                        isAgreeForPersonalInfo: agree,
                    }))}
                    category='문의' />
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
                value={formData.name && formData.email && formData.message} />
        </form>
    )
}