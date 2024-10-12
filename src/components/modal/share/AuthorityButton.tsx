import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ArrowIcon from '../../../../public/svgs/down-arrow.svg';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Collaborator } from '@/redux/features/documentSlice';
import AuthorityDropdown from './AuthorityDropdown';
import { setSelectedCoworkers } from '@/redux/features/shareDocumentSlice';

export type AuthorityCategory = '전체 허용' | '쓰기 허용' | '읽기 허용' | '관리자' | '멤버 제거';

type AuthorityButtonProps = {
    initialAuthority: AuthorityCategory;
    targetUser: Collaborator;
    isClickEnabled?: boolean;
    isMember?: boolean;
}

export default function AuthorityButton({ initialAuthority, targetUser, isClickEnabled, isMember }: AuthorityButtonProps) {
    const dispatch = useAppDispatch();
    
    const buttonRef = useRef<HTMLDivElement>(null);
    const coworkerList = useAppSelector(state => state.coworkerList);
    const selectedCoworkers = useAppSelector(state => state.selectedCoworkers);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [currentAuthority, setCurrentAuthority] = useState<AuthorityCategory>(initialAuthority);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 }); // 권한을 선택하는 드롭다운의 포지션

    // 드롭다운의 위치를 업데이트
    useEffect(() => {
        const updatePosition = () => {
            // 버튼의 현재 위치와 크기 정보를 가져옴
            const rect = buttonRef.current?.getBoundingClientRect();
            if (rect) {
                // 드롭다운의 위치: 버튼 바로 아래
                // window.scrollY와 window.scrollX를 더해 스크롤 위치 고려
                setDropdownPosition({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                });
            }
        };

        updatePosition();

        const resizeObserver = new ResizeObserver(updatePosition);
        if (buttonRef.current) {
            resizeObserver.observe(buttonRef.current);
        }

        return () => {
            if (buttonRef.current) {
                resizeObserver.unobserve(buttonRef.current);
            }
            resizeObserver.disconnect();
        };
    }, [buttonRef]);

    // 전역 상태의 변경사항을 보이기 위해 currentAuthority 업데이트
    useEffect(() => {
        // 사용자가 멤버인 경우에만 실행
        if (isMember) {
            // 현재 작업중인 협업자를 찾음
            const updatedCoworker = coworkerList.find(coworker => coworker.email === targetUser.email);
            if (updatedCoworker) {
                // 해당 협업자의 권한으로 현재 권한을 업데이트
                setCurrentAuthority(updatedCoworker.authority as AuthorityCategory);
            }
        }
    }, [coworkerList]);

    // 드롭다운을 토글
    const toggleDropdown = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentAuthority !== '관리자' && isClickEnabled) {
            setIsOpen(prev => !prev);
        }
    };

    return (
        <>
            <div
                ref={buttonRef}
                onClick={toggleDropdown}
                // 현재 권한이 관리자인지, 이메일이 정규식을 충족해 클릭이 가능한 상태인지에 따라 분기
                className={`flex items-center gap-1 px-2 py-1 text-neutral-400 rounded select-none 
                    ${currentAuthority === '관리자' ? '' :
                        (isClickEnabled ? 'hover:bg-gray-200 cursor-pointer' : '')}`}>
                <div className='whitespace-nowrap text-sm'>{currentAuthority}</div>
                {
                    currentAuthority !== '관리자' && <ArrowIcon width="17" />
                }
            </div>
            {/* React Portal을 이용하여 모달의 간섭을 받지 않도록 독립적으로 렌더링 */}
            {
                isOpen && createPortal(
                    <AuthorityDropdown
                        dropdownPosition={dropdownPosition}
                        setIsOpen={setIsOpen}
                        buttonRef={buttonRef}
                        targetUser={targetUser}
                        isMember={isMember}
                        setCurrentAuthority={setCurrentAuthority} />,
                    document.body
                )
            }
        </>
    );
}
