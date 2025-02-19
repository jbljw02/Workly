import SubmitButton from "@/components/button/SubmitButton";
import FormInput from "@/components/input/FormInput";
import { showCompleteAlert, showWarningAlert } from "@/redux/features/common/alertSlice";
import { setWorkingSpinner } from "@/redux/features/common/placeholderSlice";
import { setUser } from "@/redux/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getAuth, updateProfile } from "firebase/auth";
import { useState, useEffect } from "react";

export default function AccountInfo() {
    const dispatch = useAppDispatch();

    const user = useAppSelector(state => state.user);

    const [formData, setFormData] = useState({
        name: user.displayName,
        isSubmitted: false,
    });

    // 초기 formData 설정
    useEffect(() => {
        setFormData({
            ...formData,
            name: user.displayName,
        });
    }, [user.email]);


    const formChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // 유저 이름을 변경
    const updateUserName = async (event: { preventDefault: () => void; }) => {
        event.preventDefault(); // form의 기본 동작을 막음(조건이 만족해야 전송되도록)

        dispatch(setWorkingSpinner(true));

        // 제출 여부 true
        setFormData({
            ...formData,
            isSubmitted: true,
        });

        try {
            const auth = getAuth();
            const currentUser = auth.currentUser;

            if (currentUser) {
                await updateProfile(currentUser, {
                    displayName: formData.name,
                });
                dispatch(setUser({
                    ...user,
                    displayName: formData.name,
                }));
                dispatch(showCompleteAlert('사용자명을 성공적으로 변경했습니다.'));
            }
            else {
                dispatch(showWarningAlert('사용자명 변경에 실패했습니다.'));
            }
        } catch (error) {
            dispatch(showWarningAlert('사용자명 변경에 실패했습니다.'));
        } finally {
            dispatch(setWorkingSpinner(false));
        }
    }

    return (
        <form className='flex flex-col gap-4' onSubmit={updateUserName}>
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium pl-0.5">사용자명</label>
                <FormInput
                    type="text"
                    name="name"
                    value={formData.name}
                    setValue={formChange}
                    placeholder='사용자명'
                    autoFocus={true} />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium pl-0.5">이메일</label>
                <div className="rounded border w-full px-3 py-2.5 bg-gray-200 text-gray-400">
                    <input
                        type="email"
                        className='border-none text-[15px] outline-none bg-transparent w-full'
                        value={user.email}
                        readOnly />
                </div>
            </div>
            <div className="mt-2.5">
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
                    value={formData.name && formData.name !== user.displayName ? formData.name : ''} />
            </div>
        </form>
    )
}