import UserProfile from '@/components/aside/child/user/UserProfile';
import SubmitButton from '@/components/button/SubmitButton';
import CommonInput from '@/components/input/CommonInput';
import { updateDocuments, setSelectedDocument, Collaborator } from '@/redux/features/documentSlice';
import { setAllUsers, UserProps } from '@/redux/features/userSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useState, useCallback, useEffect, useMemo } from 'react';
import ArrowIcon from '../../../../public/svgs/down-arrow.svg';
import axios from 'axios';
import AuthorityButton from './AuthorityButton';
import ShareForm from './ShareForm';
import { setCoworkerList, setSelectedCoworkers, setTargetSharingEmail } from '@/redux/features/shareDocumentSlice';
import { emailRegex } from '@/components/auth/SignUp';

export default function ShareContent() {
    const dispatch = useAppDispatch();

    const user = useAppSelector(state => state.user);
    const selectedDocument = useAppSelector(state => state.selectedDocument);
    const documents = useAppSelector(state => state.documents);
    const allUsers = useAppSelector(state => state.allUsers); // 모든 사용자
    const coworkerList = useAppSelector(state => state.coworkerList); // 현재 문서의 협업자들
    const selectedCoworkers = useAppSelector(state => state.selectedCoworkers); // 선택된 협업자들
    const targetSharingEmail = useAppSelector(state => state.targetSharingEmail); // 공유할 사용자의 이메일

    const [selectedIndex, setSelectedIndex] = useState<number>(-1); // 선택된 협업자 인덱스
    const [isKeyboardNav, setIsKeyboardNav] = useState<boolean>(false); // 키보드 네비게이션 모드 여부
    const [isDropdownEnabled, setIsDropdownEnabled] = useState<boolean>(false); // 드롭다운 메뉴 활성화 여부

    // 검색 결과가 협업자, 모든 사용자에도 없을 경우 보여줄 프로필
    const unknownUser: Collaborator = useMemo(() => ({
        displayName: targetSharingEmail,
        email: targetSharingEmail,
        photoURL: 'unknown-user',
        authority: '전체 허용',
    }), [targetSharingEmail]);

    // 해당 문서의 협업자들을 가져와 coworkerList에 담음
    const getCoworkers = useCallback(async (email: string, docId: string) => {
        try {
            const response = await axios.get('/api/document/coworker', {
                params: { email: email, docId: docId },
            });
            dispatch(setCoworkerList(response.data as Collaborator[]));
        } catch (error) {
            console.error('협업자 가져오기 오류: ', error);
        }
    }, []);

    // 전체 사용자 가져오기
    const getAllUsers = useCallback(async () => {
        try {
            const response = await axios.get('/api/users');
            dispatch(setAllUsers(response.data as UserProps[]));
        } catch (error) {
            console.error('전체 사용자 가져오기 오류: ', error);
        }
    }, []);

    useEffect(() => {
        getCoworkers(selectedDocument.author, selectedDocument.id);
    }, [user.email, selectedDocument.id, getCoworkers]);

    useEffect(() => {
        getAllUsers();
    }, [getAllUsers]);

    // 협업자를 선택하는 함수
    const coworkerSelect = (coworker: Collaborator) => {
        if (isDropdownEnabled) {
            dispatch(setTargetSharingEmail(''));
            dispatch(setSelectedCoworkers([...selectedCoworkers, coworker]));
        }
    };

    // 모든 문서에서 협업자들을 가져와 하나의 배열에 할당
    // flat을 통해 배열을 평탄화 - 객체에 담겨있는 여러 값을 하나의 값에 몰아넣음
    const allCoworkers: Collaborator[] = useMemo(() => documents.map(doc => doc.collaborators).flat(),
        [documents]);

    console.log(coworkerList);

    // console.log(allCoworkers);

    // 필터링된 협업자 목록 생성
    // input의 값과 사용자의 이메일이 정확히 일치할 때만 해당 사용자를 출력하고, 
    // 부분적으로 일치할 때는 전체 사용자가 아닌 협업자 목록에서 검색 후 제안
    const searchedCoworkers: Collaborator[] = useMemo(() => {
        if (targetSharingEmail.trim() === '') {
            return [];
        }

        // 전체 사용자 목록에서 '정확히' 일치하는 사용자 검색
        const allUsersMatched = allUsers.find(user =>
            user.email.toLowerCase() === targetSharingEmail.trim().toLowerCase()
        );

        // 찾은 사용자가 협업자 목록에도 있다면 그 값을 사용하고(권한을 일치시키기 위해),
        // 없다면 협업자가 아니라는 의미이므로, authority를 포함한 새로운 객체 생성
        if (allUsersMatched) {
            return [
                coworkerList.find(coworker => coworker.email === allUsersMatched.email) ||
                {
                    ...allUsersMatched,
                    authority: '전체 허용',
                }
            ];
        }

        // 협업자 목록에서 '부분' 일치하는 사용자 검색
        const coworkersMatched = coworkerList.filter(coworker => {
            const [localPart] = coworker.email.split('@'); // 도메인 앞부분만 추출해서 검색
            return localPart.toLowerCase().includes(targetSharingEmail.trim().toLowerCase());
        });

        return coworkersMatched;
    }, [targetSharingEmail, coworkerList, allUsers]);

    // 검색된 협업자가 있다면 해당 사용자의 프로필을 보여주고,
    // 없다면 알 수 없는 임시 프로필을 보여줌
    const displayedUsers = useMemo(() => {
        return searchedCoworkers.length > 0 ? searchedCoworkers : [unknownUser];
    }, [searchedCoworkers, unknownUser]);

    // 검색된 협업자들 중 키보드로 사용자 이동 및 선택
    const coworkerNavigate = useCallback((e: KeyboardEvent) => {
        if (displayedUsers.length === 0) return;
        if (!isKeyboardNav) return;

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
            coworkerSelect(selectedUser);
        }
    }, [displayedUsers, selectedIndex, setTargetSharingEmail]);

    useEffect(() => {
        window.addEventListener('keydown', coworkerNavigate);
        return () => {
            window.removeEventListener('keydown', coworkerNavigate);
        };
    }, [coworkerNavigate]);

    // 검색된 협업자가 존재하는지에 따라 선택된 항목과 키보드 네비게이션 모드 설정
    useEffect(() => {
        if (emailRegex.test(targetSharingEmail) || searchedCoworkers.length > 0) {
            setSelectedIndex(0); // 첫번째 협업자 선택
            setIsKeyboardNav(true);

            // 드롭다운 메뉴 활성화 여부 - 이메일 형식이 맞거나 검색된 협업자가 있을 때만 활성화
            setIsDropdownEnabled(true);
        }
        else {
            setSelectedIndex(-1);
            setIsKeyboardNav(false);
            setIsDropdownEnabled(false);
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
            {/* 사용자를 초대하는 작업을 처리하는 폼 */}
            <ShareForm />
            {
                // 사용자 배열의 값이 초기값이 아닐 때
                displayedUsers.length > 0 && displayedUsers[0].email && (
                    <div className="absolute w-[480px] left-0 right-0 z-50 flex flex-col p-2 mt-2 border rounded-lg mx-5 bg-white shadow-xl">
                        {
                            displayedUsers.map((coworker, index) => (
                                <button
                                    key={coworker.email}
                                    // 드롭다운 메뉴가 활성화되어 있으며 현재 선택된 항목이 있을 때 배경색 변경
                                    className={`flex flex-row w-full items-center justify-between pl-3 pr-2 py-2 rounded select-none text-left
                                        ${selectedIndex === index && isDropdownEnabled && 'bg-gray-100'}
                                        ${!isDropdownEnabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                    disabled={!isDropdownEnabled}
                                    onClick={() => coworkerSelect(coworker)}
                                    onMouseEnter={() => coworkerMouseEnter(index)}
                                    onMouseLeave={coworkerMouseLeave}>
                                    <UserProfile
                                        user={coworker}
                                        isAlreadyCoworker={coworkerList.some(user => user.email === coworker.email)} />
                                    <AuthorityButton
                                        targetUser={coworker}
                                        isClickEnabled={isDropdownEnabled}
                                        initialAuthority={coworker.email === selectedDocument.author ? '관리자' : coworker.authority}
                                        isMember={coworkerList.some(user => user.email === coworker.email)} />
                                </button>
                            ))
                        }
                    </div>
                )}
            {/* 현재 문서에 접근 권한이 있는 사용자를 나열 */}
            <div className='flex flex-col mt-7 px-5'>
                <div className='text-sm font-semibold mb-4'>접근 권한이 있는 사용자</div>
                <div className='flex flex-col gap-4 max-h-[120px] overflow-y-scroll scrollbar-thin'>
                    <div className='flex flex-row items-center justify-between'>
                        <UserProfile user={user} />
                        <AuthorityButton
                            targetUser={{ ...user, authority: '관리자' }}
                            isClickEnabled={true}
                            initialAuthority='관리자' />
                    </div>
                    {
                        coworkerList.map(coworker => (
                            <div className='flex flex-row items-center justify-between'>
                                <UserProfile user={coworker} />
                                <AuthorityButton
                                    targetUser={coworker}
                                    isClickEnabled={true}
                                    initialAuthority={coworker.authority}
                                    isMember={true} />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}