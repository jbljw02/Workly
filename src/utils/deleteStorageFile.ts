import { getStorage, ref, deleteObject, listAll } from "firebase/storage";

// 스토리지에 존재하는 문서 관련 파일을 모두 삭제
const deleteStorageFile = async (docId: string) => {
    const storage = getStorage();
    const documentFolderRef = ref(storage, `documents/${docId}`);

    try {
        // 해당 경로의 모든 파일과 하위 폴더 목록을 가져옴
        const listResult = await listAll(documentFolderRef);

        // 모든 파일 삭제
        const deletePromises = listResult.items.map(item => deleteObject(item));

        // 하위 폴더의 모든 파일 삭제
        const subFolderDeletePromises = listResult.prefixes.map(async (folderRef) => {
            const subListResult = await listAll(folderRef);
            return Promise.all(subListResult.items.map(item => deleteObject(item)));
        });

        // 모든 삭제 작업 완료 대기
        await Promise.all([...deletePromises, ...subFolderDeletePromises]);
    } catch (error) {
        console.warn(`스토리지 파일 삭제 실패(문서 ID: ${docId}):`, error);
    }
};

export default deleteStorageFile;