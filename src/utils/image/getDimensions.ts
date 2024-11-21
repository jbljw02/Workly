const getDimensions = (src: string): Promise<{ width: number, height: number }> => {
    return new Promise((resolve) => {
        // 새로운 Image 객체 생성
        const img = new Image();

        // 이미지가 로드되면 실행
        img.onload = () => {
            // 이미지의 최대 너비 설정(600px)
            const maxWidth = 600;
            // 원본 이미지의 너비와 높이
            let width = img.width;
            let height = img.height;

            // 이미지 너비가 최대 너비보다 큰 경우 크기 조정
            if (width > maxWidth) {
                // 비율 계산(maxWidth / 원본 너비)
                const ratio = maxWidth / width;
                // 너비를 최대 너비로 설정
                width = maxWidth;
                // 높이를 비율에 맞게 조정(반올림 처리)
                height = Math.round(height * ratio);
            }

            // 계산된 너비와 높이를 반환
            resolve({ width, height });
        };

        // 이미지 소스 설정하여 로드 시작
        img.src = src;
    });
};

export default getDimensions;