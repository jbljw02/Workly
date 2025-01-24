// 문서 크기를 체크
const checkDocumentSize = (document: any): number => {
    return new TextEncoder().encode(JSON.stringify(document)).length;
};

export default checkDocumentSize;