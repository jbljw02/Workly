// 데모 파일 업로드
const uploadDemoFile = async (file: File | Blob) => {
    return new Promise<string>((resolve) => {
        setTimeout(() => {
            const url = URL.createObjectURL(file);
            resolve(url);
        }, 1000);
    });
}

export default uploadDemoFile;