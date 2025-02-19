import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import Image from "next/image";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, updateProfile } from "firebase/auth";
import { setUser } from "@/redux/features/user/userSlice";
import { useState } from "react";
import LoadingSpinner from "@/components/placeholder/LoadingSpinner";
import { showWarningAlert } from "@/redux/features/common/alertSlice";

export default function ProfileSection() {
    const user = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    const [isImageUploading, setIsImageUploading] = useState(false);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            dispatch(showWarningAlert("프로필 이미지를 선택해주세요."));
            return;
        }

        try {
            setIsImageUploading(true);

            const storage = getStorage();
            const storageRef = ref(storage, `profile/${user.uid}/${file.name}`);

            // 이미지 업로드
            await uploadBytes(storageRef, file);

            // 업로드 된 이미지의 URL 가져오기
            const photoURL = await getDownloadURL(storageRef);

            const auth = getAuth();
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, { photoURL });

                dispatch(setUser({
                    ...user,
                    photoURL: photoURL
                }))
            }
        } catch (error) {
            dispatch(showWarningAlert("프로필 이미지 변경에 실패했습니다."));
        } finally {
            setIsImageUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="relative group mb-4">
                <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden" />
                <label htmlFor="profileImage" className="w-[100px] h-[100px] rounded-full">
                    {
                        isImageUploading ?
                            <div className="w-[100px] h-[100px] rounded-full bg-black">
                                <LoadingSpinner size={30} color="#ffffff" />
                            </div> :
                            <>
                                <Image
                                    src={user.photoURL === 'unknown-user' ? '/svgs/add-user.svg' : user.photoURL}
                                    alt={user.displayName}
                                    width={100}
                                    height={100}
                                    className="rounded-full object-cover w-[100px] h-[100px]" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <span className="text-white text-sm">변경</span>
                                </div>
                            </>
                    }
                </label>
            </div>
            <h1 className="text-[22px] font-semibold">{user.displayName}</h1>
            <div className="text-[15px] text-zinc-500">{user.email}</div>
        </div>
    )
}