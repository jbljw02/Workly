const formatTimeDiff = (readedAt: { seconds: number, nanoseconds: number }, isPublished?: boolean) => {
    const now = new Date(); // 현재 시간

    // 타임스탬프의 seconds와 nanoseconds를 밀리초로 변환하여 합침
    const readedAtMs = readedAt.seconds * 1000 + readedAt.nanoseconds / 1000000;
    const readedAtUtc = new Date(readedAtMs); // 밀리초를 사용하여 Date 객체 생성

    const diffMs = now.getTime() - readedAtUtc.getTime(); // 시간 차이를 밀리초로 계산

    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    // 오차가 1분 이내라면 "방금"
    if (diffMinutes < 1) {
        return isPublished ? "방금 게시" : "방금 열람";
    }
    else if (diffMinutes < 60) {
        return isPublished ? `${diffMinutes}분 전 게시` : `${diffMinutes}분 전 열람`;
    }
    else if (diffHours < 24) {
        return isPublished ? `${diffHours}시간 전 게시` : `${diffHours}시간 전 열람`;
    }
    else {
        return isPublished ? `${diffDays}일 전 게시` : `${diffDays}일 전 열람`;
    }
};

export default formatTimeDiff;