import UserProfile from '@/components/aside/child/user/UserProfile';
import SubmitButton from '@/components/button/SubmitButton';
import CommonInput from '@/components/input/CommonInput';
import { updateDocuments, setSelectedDocument } from '@/redux/features/documentSlice';
import { UserProps } from '@/redux/features/userSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useState, useCallback, useEffect, useMemo } from 'react';
import ArrowIcon from '../../../../public/svgs/down-arrow.svg';
import axios from 'axios';
import AuthorityButton from './AuthorityButton';
import UserAddIcon from '../../../../public/svgs/add-user.svg';
import { firebasedb } from '../../../../firebase/firebasedb';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

type ShareContentProps = {
    targetEmail: string;
    setTargetEmail: React.Dispatch<React.SetStateAction<string>>;
    closeModal: () => void;
}

export default function ShareContent({ targetEmail, setTargetEmail, closeModal }: ShareContentProps) {
    const dispatch = useAppDispatch();

    const user = useAppSelector(state => state.user);

    const documents = useAppSelector(state => state.documents);
    const selectedDocument = useAppSelector(state => state.selectedDocument);

    const [coworkerList, setCoworkerList] = useState<UserProps[]>([]);

    // 사용자의 협업자들을 가져와 coworkerList에 담음
    const getCoworkers = useCallback(async (email: string) => {
        try {
            const response = await axios.get('/api/coworker', {
                params: { email },
            });
            console.log("response.data:", response.data)

            setCoworkerList(response.data as UserProps[]);
        } catch (error) {
            console.error('협업자 가져오기 오류: ', error);
        }
    }, []);

    useEffect(() => {
        getCoworkers(user.email);
    }, [user.email, getCoworkers]);

    // 전체 사용자 가져오기
    const getAllUsers = useCallback(async () => {
        try {
            const response = await axios.get('/api/users');
            console.log("response.data:", response.data);

        } catch (error) {
            console.error('전체 사용자 가져오기 오류: ', error);
        }
    }, []);

    useEffect(() => {
        getAllUsers();
    }, [getAllUsers]);

    // 이메일 리스트에서 input의 값을 포함하는 것들만 다시 필터링
    const searchedCoworkers = useMemo(() => {
        if (targetEmail.trim() === '') {
            return [];
        }
        return coworkerList.filter(user =>
            user.email.toLowerCase().includes(targetEmail.toLowerCase().trim())
        );
    }, [targetEmail, coworkerList]);


    // 다른 사용자와 문서를 공유하기 위해 초대
    const inviteUser = async (e: React.FormEvent) => {
        e.preventDefault();

        const newDoc = {
            ...selectedDocument,
            collaborators: [...selectedDocument.collaborators, targetEmail],
        }

        dispatch(updateDocuments({ docId: newDoc.id, ...newDoc }));
        dispatch(setSelectedDocument(newDoc));
    }

    const unknownUser = useMemo(() => ({
        displayName: targetEmail,
        email: targetEmail,
        photoURL: 'unknown-user',
    }), [targetEmail]);

    return (
        <div className="relative">
            <form
                onSubmit={inviteUser}
                className='flex flex-row items-center justify-between px-5 gap-6' >
                <div className='w-[480px]'>
                    <CommonInput
                        type="text"
                        value={targetEmail}
                        setValue={setTargetEmail}
                        placeholder={'초대할 사용자의 이메일'}
                        autoFocus={true} />
                </div>
                <SubmitButton
                    style={{
                        px: 'px-3.5',
                        py: 'py-2.5',
                        textSize: 'text-sm',
                        textColor: 'text-white',
                        bgColor: 'bg-blue-500',
                        hover: 'hover:bg-blue-700',
                    }}
                    label='초대'
                    value={targetEmail} />
            </form>
            {
                // input 있을 때만 렌더링
                targetEmail && (
                    <div className='absolute left-0 right-0 z-50 flex flex-col p-2 mt-2 border rounded-lg mx-5 bg-white shadow-xl'>
                        {
                            // 검색된 협업자가 있다면 해당 사용자의 프로필을 보여주고,
                            // 없다면 알 수 없는 사용자의 프로필을 보여줌
                            searchedCoworkers.length > 0 ?
                                searchedCoworkers.map(user => (
                                    <div
                                        key={user.email}
                                        className="flex w-full items-center justify-between px-3 py-2 hover:bg-gray-100 rounded">
                                        <UserProfile user={user} />
                                        <AuthorityButton />
                                    </div>
                                )) :
                                <div className='flex items-center justify-center px-3 py-2'>
                                    <UserProfile user={unknownUser} />
                                    <AuthorityButton />
                                </div>
                        }
                    </div>
                )
            }
            {/* 현재 문서에 접근 권한이 있는 사용자를 나열 */}
            <div className='flex flex-col mt-7 px-5'>
                <div className='text-sm font-semibold mb-4'>접근 권한이 있는 사용자</div>
                <div className='flex flex-col gap-4 max-h-[120px] overflow-y-scroll scrollbar-thin'>
                    <div className='flex flex-row items-center justify-between'>
                        <UserProfile user={user} />
                        <button className='flex flex-row items-center justify-center gap-1 px-2 py-1 text-neutral-400 rounded hover:bg-gray-100'>
                            <div className='whitespace-nowrap text-sm'>전체 허용</div>
                            <ArrowIcon width="17" />
                        </button>
                    </div>
                    <div className='flex flex-row items-center justify-between'>
                        <UserProfile user={user} />
                        <button className='flex flex-row items-center justify-center gap-1 px-2 py-1 text-neutral-400 rounded hover:bg-gray-100'>
                            <div className='whitespace-nowrap text-sm'>전체 허용</div>
                            <ArrowIcon width="17" />
                        </button>
                    </div>
                </div>
            </div >
        </div>
    )
}