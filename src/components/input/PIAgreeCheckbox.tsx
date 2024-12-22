type PIAgreeCheckboxProps = {
    formData: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isVibrate: boolean;
    setIsPIModalOpen: (isOpen: boolean) => void;
}

export default function PIAgreeCheckbox({ formData, onChange, isVibrate, setIsPIModalOpen }: PIAgreeCheckboxProps) {
    return (
        <div className="flex flex-row gap-1.5 text-sm">
            <input
                type="checkbox"
                className="cursor-pointer"
                onChange={onChange}
                checked={formData.isAgreeForPersonalInfo} />
            <div>
                <button
                    type="button"
                    onClick={() => setIsPIModalOpen(true)}
                    className={`underline 
                                ${isVibrate && 'vibrate'} 
                                ${(formData.isSubmitted && !formData.isAgreeForPersonalInfo) && 'text-red-500'}`}>개인정보 처리방침</button>
                에 동의합니다.
            </div>
        </div>
    )
}