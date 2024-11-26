import { showWarningAlert } from '@/redux/features/alertSlice';
import { AppDispatch } from '@/redux/store';
import Nprogress from 'nprogress';

const downloadFile = async (href: string, download: string, dispatch: AppDispatch) => {
    try {
        Nprogress.start();

        // URL을 blob으로 변환
        const response = await fetch(href);
        const blob = await response.blob();

        // Blob URL 생성
        const blobUrl = window.URL.createObjectURL(blob);

        // 다운로드 링크 생성 및 실행
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = download;
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error('파일 다운로드 중 오류 발생:', error);
        dispatch(showWarningAlert('파일 다운로드에 실패했습니다.'));
    } finally {
        Nprogress.done();
    }
}

export default downloadFile;