import UserProfile from '@/components/aside/child/user/UserProfile';
import SubmitButton from '@/components/button/SubmitButton';
import CommonInput from '@/components/input/CommonInput';
import { Collaborator } from '@/redux/features/documentSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useState, useCallback, useEffect, useMemo } from 'react';
import AuthorityButton, { AuthorityCategory } from './AuthorityButton';
import ShareForm from './ShareForm';
import { setCoworkerList, setSearchedCoworkers, setSelectedCoworkers, setTargetSharingEmail } from '@/redux/features/shareDocumentSlice';
import { emailRegex } from '@/components/auth/SignUp';
import { WorkingDocModalProps } from '@/types/workingDocModalProps';
import { DocumentProps } from '@/redux/features/documentSlice';

type ShareContentProps = {
    selectedDoc: DocumentProps;
}

export default function ShareContent({ selectedDoc }: ShareContentProps) {
    const dispatch = useAppDispatch();

    const user = useAppSelector(state => state.user);
    const allUsers = useAppSelector(state => state.allUsers); // 모든 사용자
    const coworkerList = useAppSelector(state => state.coworkerList); // 현재 문서의 협업자들
    const selectedCoworkers = useAppSelector(state => state.selectedCoworkers); // 선택된 협업자들
    const targetSharingEmail = useAppSelector(state => state.targetSharingEmail); // 공유할 사용자의 이메일
    const searchedCoworkers = useAppSelector(state => state.searchedCoworkers); // 검색된 협업자들

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

    // 협업자를 선택하는 함수
    const coworkerSelect = (coworker: Collaborator) => {
        if (isDropdownEnabled) {
            dispatch(setTargetSharingEmail(''));
            dispatch(setSelectedCoworkers([...selectedCoworkers, coworker]));
        }
    };

    // 필터링된 협업자 목록 생성
    // input의 값과 사용자의 이메일이 정확히 일치할 때만 해당 사용자를 출력하고, 
    // 부분적으로 일치할 때는 전체 사용자가 아닌 협업자 목록에서 검색 후 제안
    useEffect(() => {
        if (targetSharingEmail.trim() === '') {
            dispatch(setSearchedCoworkers([]));
            return;
        }

        // 전체 사용자 목록에서 '정확히' 일치하는 사용자 검색
        const allUsersMatched = allUsers.find(user =>
            user.email.toLowerCase() === targetSharingEmail.trim().toLowerCase()
        );

        // 찾은 사용자가 협업자 목록에도 있다면 그 값을 사용하고(권한을 일치시키기 위해),
        // 없다면 협업자가 아니라는 의미이므로, authority를 포함한 새로운 객체 생성
        if (allUsersMatched) {
            const matchedCoworker = [
                coworkerList.find(coworker => coworker.email === allUsersMatched.email) ||
                {
                    ...allUsersMatched,
                    authority: '전체 허용',
                }
            ];
            dispatch(setSearchedCoworkers(matchedCoworker));
            return;
        }

        // 협업자 목록에서 '부분' 일치하는 사용자 검색
        const coworkersMatched = coworkerList.filter(coworker => {
            const [localPart] = coworker.email.split('@'); // 도메인 앞부분만 추출해서 검색
            return localPart.toLowerCase().includes(targetSharingEmail.trim().toLowerCase());
        });

        // 검색된 협업자가 있다면 해당 사용자의 프로필을 보여주고,
        // 없다면 임시 프로필을 보여줌
        dispatch(setSearchedCoworkers(coworkersMatched.length > 0 ? coworkersMatched : [unknownUser]));
    }, [targetSharingEmail, coworkerList, allUsers, dispatch, unknownUser]);

    // 검색된 협업자들 중 키보드로 사용자 이동 및 선택
    const coworkerNavigate = useCallback((e: KeyboardEvent) => {
        if (searchedCoworkers.length === 0) return;
        if (!isKeyboardNav) return;

        // 위쪽 또는 아래쪽 화살표 키를 눌렀을 때
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            setIsKeyboardNav(true); // 키보드 네비게이션 모드 활성화
            setSelectedIndex(prev => {
                if (e.key === 'ArrowDown') {
                    // 아래쪽 화살표: 다음 항목 선택
                    // e.g. 마지막 항목에서 아래쪽 화살표를 누르면 첫번째 항목으로 이동.. (2+1)%3=0
                    return (prev + 1) % searchedCoworkers.length;
                }
                else {
                    // 위쪽 화살표: 이전 항목 선택
                    return (prev - 1 + searchedCoworkers.length) % searchedCoworkers.length;
                }
            });
        }
        // Enter 키를 눌렀고 선택된 항목이 있을 때
        else if (e.key === 'Enter' && selectedIndex !== -1) {
            e.preventDefault();
            const selectedUser = searchedCoworkers[selectedIndex]; // 선택된 사용자 가져오기
            coworkerSelect(selectedUser);
        }
    }, [searchedCoworkers, selectedIndex, setTargetSharingEmail]);

    useEffect(() => {
        window.addEventListener('keydown', coworkerNavigate);
        return () => {
            window.removeEventListener('keydown', coworkerNavigate);
        };
    }, [coworkerNavigate]);

    // 검색된 협업자가 존재하는지에 따라 선택된 항목과 키보드 네비게이션 모드 설정
    useEffect(() => {
        if (emailRegex.test(targetSharingEmail) && searchedCoworkers.length > 0) {
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
            <ShareForm selectedDoc={selectedDoc} />
            {
                // 사용자 배열의 값이 초기값이 아닐 때
                searchedCoworkers.length > 0 && searchedCoworkers[0].email && (
                    <div className="absolute w-[480px] left-0 right-0 z-50 flex flex-col p-2 mt-2 border rounded-lg mx-5 bg-white shadow-xl">
                        {
                            searchedCoworkers.map((coworker, index) => (
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
                                        initialAuthority={coworker.email === selectedDoc.author.email ? '관리자' : coworker.authority}
                                        selectedDoc={selectedDoc}
                                        isMember={coworkerList.some(user => user.email === coworker.email)} />
                                </button>
                            ))
                        }
                    </div>
                )}
            {/* 현재 문서에 접근 권한이 있는 사용자를 나열 */}
            <div className='flex flex-col mt-7 px-5'>
                <div className='text-sm font-semibold mb-4'>접근 권한이 있는 사용자</div>
                <div className='flex flex-col gap-4 pb-4 min-h-[105px] max-h-[600px] overflow-y-scroll scrollbar-thin'>
                    <div className='flex flex-row items-center justify-between'>
                        <UserProfile user={selectedDoc.author} />
                        <AuthorityButton
                            targetUser={{ ...user, authority: '관리자' }}
                            isClickEnabled={true}
                            initialAuthority='관리자'
                            selectedDoc={selectedDoc} />
                    </div>
                    {
                        selectedDoc.collaborators.map(coworker => (
                            <div
                                key={coworker.email}
                                className='flex flex-row items-center justify-between'>
                                <UserProfile user={coworker} />
                                <AuthorityButton
                                    targetUser={coworker}
                                    isClickEnabled={true}
                                    initialAuthority={coworker.authority}
                                    isMember={true}
                                    selectedDoc={selectedDoc} />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}