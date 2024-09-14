export default function formatTimeDiff(updatedAt: string) {
    const now = new Date(); // 현재 시간
    const updatedAtUtc = new Date(updatedAt); // updatedAt을 ISO 형식에서 UTC로 변환(로컬 시간 반영)

    const diffMs = now.getTime() - updatedAtUtc.getTime(); // 시간 차이를 밀리초로 계산

    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    // 현재 편집 중인지 여부를 확인(1분 이내 차이면 "현재 편집 중")
    if (diffMinutes < 1) {
        return "현재 편집 중";
    }
    else if (diffMinutes < 60) {
        return `${diffMinutes}분 전 편집`;
    }
    else if (diffHours < 24) {
        return `${diffHours}시간 전 편집`;
    }
    else {
        return `${diffDays}일 전 편집`;
    }
}