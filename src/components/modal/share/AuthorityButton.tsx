import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import ArrowIcon from '../../../../public/svgs/down-arrow.svg';
import { useClickOutside } from '@/components/hooks/useClickOutside';

type AuthorityCategory = '전체 허용' | '쓰기 허용' | '읽기 허용';

interface DropdownProps {
    dropdownPosition: { top: number; left: number };
    authorityList: Array<{ label: string; description: string }>;
    setAuthority: (authority: AuthorityCategory) => void;
    setIsOpen: (isOpen: boolean) => void;
    buttonRef: React.RefObject<HTMLDivElement>;
}

// 권한을 선택하는 드롭다운
function Dropdown({
    dropdownPosition,
    authorityList,
    setAuthority,
    setIsOpen,
    buttonRef }: DropdownProps) {
    const dropdownRef = useRef<HTMLDivElement>(null);
    useClickOutside(dropdownRef, () => setIsOpen(false), buttonRef);
    return (
        <div
            ref={dropdownRef}
            style={{
                position: 'absolute',
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                zIndex: 50,
            }}
            className='flex flex-col bg-white border border-gray-200 rounded shadow-xl'>
            {
                authorityList.map((authority, index) => (
                    <button
                        key={index}
                        className='flex flex-col px-3 py-2 text-sm hover:bg-gray-100'
                        onClick={(e) => {
                            setAuthority(authority.label as AuthorityCategory);
                            setIsOpen(false);
                        }}>
                        <div className='text-sm'>{authority.label}</div>
                        <div className='text-xs text-neutral-400 whitespace-nowrap'>{authority.description}</div>
                    </button>
                ))}
        </div>
    );
}

export default function AuthorityButton() {
    const buttonRef = useRef<HTMLDivElement>(null);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

    const [authority, setAuthority] = useState<AuthorityCategory>('전체 허용');

    const authorityList = [
        {
            label: '전체 허용',
            description: '문서를 편집하고, 다른 사용자에게 공유할 수 있습니다.'
        },
        {
            label: '쓰기 허용',
            description: '문서를 열람하고 편집할 수 있습니다.'
        },
        {
            label: '읽기 허용',
            description: '문서를 열람할 수 있습니다.'
        }
    ];

    useEffect(() => {
        if (!buttonRef.current) return;

        // 드롭다운 위치를 업데이트하는 함수
        const updatePosition = () => {
            const rect = buttonRef.current?.getBoundingClientRect();
            if (rect) {
                // 버튼의 위치를 기반으로 드롭다운 위치 설정
                setDropdownPosition({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                });
            }
        };

        const resizeObserver = new ResizeObserver(updatePosition);
        resizeObserver.observe(buttonRef.current);

        // 드롭다운이 열릴 때 위치 업데이트
        if (isOpen) {
            updatePosition();
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, [isOpen]);

    return (
        <>
            <div
                ref={buttonRef}
                onClick={(e) => {
                    setIsOpen((prevState) => !prevState);
                }}
                className='flex flex-row items-center justify-center gap-1 px-2 py-1 text-neutral-400 rounded hover:bg-gray-200 select-none cursor-pointer'>
                <div className='whitespace-nowrap text-sm'>{authority}</div>
                <ArrowIcon width="17" />
            </div>
            <div>
                {/* React Portal을 이용하여 독립적으로 렌더링 */}
                {
                    isOpen &&
                    createPortal(
                        <Dropdown
                            dropdownPosition={dropdownPosition}
                            authorityList={authorityList}
                            setAuthority={setAuthority}
                            setIsOpen={setIsOpen}
                            buttonRef={buttonRef}
                        />,
                        document.body)
                }
            </div>
        </>
    );
}