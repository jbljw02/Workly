'use client';

import InvalidAccess from '../invalid-access/InvalidAccess';
import NotFoundIcon from '../../../public/svgs/not-found.svg';

export default function NotFound() {
    return (
        <InvalidAccess
            title="잘못된 접근 경로"
            description={
                <>
                    페이지를 찾을 수 없습니다.
                    <br />
                    삭제됐거나 존재하지 않는 문서입니다.
                </>
            }
            Icon={NotFoundIcon}
            iconWidth="62" />
    )
}