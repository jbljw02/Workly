'use client';

import InvalidAccess from "../invalid-access/InvalidAccess";
import DocumentNotFoundIcon from '../../../public/svgs/document-not-found.svg';

export default function DocumentNotFound() {
    return (
        <InvalidAccess
            title="존재하지 않는 문서"
            description={
                <>
                    페이지를 찾을 수 없습니다.
                    <br />
                    삭제됐거나 존재하지 않는 문서입니다.
                </>
            }
            Icon={DocumentNotFoundIcon}
            iconWidth="62" />
    );
}