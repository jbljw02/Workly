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

type ShareContentProps = {
    targetEmail: string;
    setTargetEmail: React.Dispatch<React.SetStateAction<string>>;
    closeModal: () => void;
}

export default function ShareContent({ targetEmail, setTargetEmail, closeModal }: ShareContentProps) {
    const dispatch = useAppDispatch();

    const user = useAppSelector(state => state.user);
    const selectedDocument = useAppSelector(state => state.selectedDocument);

    const [allUsers, setAllUsers] = useState<UserProps[]>([]); // 모든 사용자
    const [coworkerList, setCoworkerList] = useState<UserProps[]>([]); // 현재 계정의 협업자들

    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    const [isKeyboardNav, setIsKeyboardNav] = useState<boolean>(false);

    // 검색 결과가 협업자, 모든 사용자에도 없을 경우 보여줄 프로필
    const unknownUser = useMemo(() => ({
        displayName: targetEmail,
        email: targetEmail,
        photoURL: 'unknown-user',
    }), [targetEmail]);

    // 사용자의 협업자들을 가져와 coworkerList에 담음
    const getCoworkers = useCallback(async (email: string) => {
        try {
            const response = await axios.get('/api/coworker', {
                params: { email },
            });
            setCoworkerList(response.data as UserProps[]);
        } catch (error) {
            console.error('협업자 가져오기 오류: ', error);
        }
    }, []);

    // 전체 사용자 가져오기
    const getAllUsers = useCallback(async () => {
        try {
            const response = await axios.get('/api/users');
            setAllUsers(response.data as UserProps[]);
        } catch (error) {
            console.error('전체 사용자 가져오기 오류: ', error);
        }
    }, []);

    useEffect(() => {
        getCoworkers(user.email);
    }, [user.email, getCoworkers]);

    useEffect(() => {
        getAllUsers();
    }, [getAllUsers]);

    // 필터링된 협업자 목록 생성
    // input의 값과 사용자의 이메일이 정확히 일치할 때만 해당 사용자를 출력하고, 
    // 부분적으로 일치할 때는 전체 사용자가 아닌 협업자 목록에서 검색 후 제안
    const searchedCoworkers = useMemo(() => {
        if (targetEmail.trim() === '') {
            return [];
        }

        // 전체 사용자 목록에서 '정확히' 일치하는 사용자 검색
        const allUsersMatched = allUsers.find(user =>
            user.email.toLowerCase() === targetEmail.trim().toLowerCase().trim()
        );

        // 협업자 목록에서 '부분' 일치하는 사용자 검색
        const coworkersMatched = coworkerList.filter(user =>
            user.email.toLowerCase().includes(targetEmail.trim().toLowerCase().trim())
        );

        // 정확히 일치하는 사용자가 있으면 먼저 추가, 그 다음 부분 일치하는 협업자들 추가
        return allUsersMatched
            ? [allUsersMatched, ...coworkersMatched.filter(user => user.email !== allUsersMatched.email)]
            : coworkersMatched;
    }, [targetEmail, allUsers, coworkerList]);

    // 검색된 협업자가 있다면 해당 사용자의 프로필을 보여주고,
    // 없다면 알 수 없는 임시 프로필을 보여줌
    const displayedUsers = useMemo(() => {
        return searchedCoworkers.length > 0 ? searchedCoworkers : [unknownUser];
    }, [searchedCoworkers, unknownUser]);

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

    // 검색된 협업자들 중 키보드로 사용자 이동 및 선택
    const coworkerNavigate = useCallback((e: KeyboardEvent) => {
        if (displayedUsers.length === 0) return;

        // 위쪽 또는 아래쪽 화살표 키를 눌렀을 때
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            setIsKeyboardNav(true); // 키보드 네비게이션 모드 활성화
            setSelectedIndex(prev => {
                if (e.key === 'ArrowDown') {
                    // 아래쪽 화살표: 다음 항목 선택
                    // e.g. 마지막 항목에서 아래쪽 화살표를 누르면 첫번째 항목으로 이동.. (2+1)%3=0
                    return (prev + 1) % displayedUsers.length;
                }
                else {
                    // 위쪽 화살표: 이전 항목 선택
                    return (prev - 1 + displayedUsers.length) % displayedUsers.length;
                }
            });
        }
        // Enter 키를 눌렀고 선택된 항목이 있을 때
        else if (e.key === 'Enter' && selectedIndex !== -1) {
            e.preventDefault();
            const selectedUser = displayedUsers[selectedIndex]; // 선택된 사용자 가져오기
            setTargetEmail(selectedUser.email); // 선택된 사용자의 이메일을 타겟 이메일로 설정
        }
    }, [displayedUsers, selectedIndex, setTargetEmail]);

    useEffect(() => {
        window.addEventListener('keydown', coworkerNavigate);
        return () => {
            window.removeEventListener('keydown', coworkerNavigate);
        };
    }, [coworkerNavigate]);

    // 검색된 협업자가 존재하는지에 따라 선택된 항목과 키보드 네비게이션 모드 설정
    useEffect(() => {
        if (searchedCoworkers.length > 0) {
            setSelectedIndex(0); // 첫번째 협업자 선택
            setIsKeyboardNav(true);
        }
        else {
            setSelectedIndex(-1);
        }
    }, [searchedCoworkers]);

    // 마우스를 올렸을 때 키보드 네비게이션 모드를 해제하고 선택된 항목 설정
    const coworkerMouseEnter = (index: number) => {
        setIsKeyboardNav(false);
        setSelectedIndex(index);
    };

    // 마우스를 떼었을 때 선택된 항목 해제
    const coworkerMouseLeave = () => {
        if (!isKeyboardNav) {
            setSelectedIndex(-1);
        }
    };

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
                    <div className='absolute w-[480px] left-0 right-0 z-50 flex flex-col p-2 mt-2 border rounded-lg mx-5 bg-white shadow-xl'>
                        {
                            displayedUsers.map((user, index) => (
                                <div
                                    key={user.email}
                                    className={`flex flex-row w-full items-center justify-between pl-3 pr-2 py-2 rounded cursor-pointer select-none 
                                        ${index === selectedIndex ? 'bg-gray-100' : ''}`}
                                    onMouseEnter={() => coworkerMouseEnter(index)}
                                    onMouseLeave={coworkerMouseLeave}>
                                    <UserProfile user={user} />
                                    <AuthorityButton />
                                </div>
                            ))
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
                        <AuthorityButton />
                    </div>
                </div>
            </div>
        </div>
    )
}