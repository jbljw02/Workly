'use client';

import DeniedIcon from '../../../public/svgs/denied.svg';
import InvalidAccess from '../invalid-access/InvalidAccess';

export default function AccessDenied() {
    return (
        <InvalidAccess
            title="접근 권한이 없음"
            description={
                <>
                    현재 페이지에 대한 접근 권한이 없습니다.
                    <br />
                    페이지의 관리자에게 권한을 요청해주세요.
                </>
            }
            Icon={DeniedIcon}
            iconWidth="60" />
    )
}