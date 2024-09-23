import { LinkTooltip, setLinkTooltip } from "@/redux/features/linkSlice";
import { Editor } from "@tiptap/react";
import { AppDispatch } from "@/redux/store";

export default function deleteLink(
    editor: Editor,
    linkTooltip: LinkTooltip,
    dispatch: AppDispatch
) {
    // 링크가 존재하지 않거나 선택되지 않았을 경우
    if (!linkTooltip.id || !linkTooltip.href || !linkTooltip.position) {
        return;
    }

    const { state } = editor;
    const { tr } = state;

    let linkFound = false;

    state.doc.descendants((node, pos) => {
        const linkMark = node.marks.find(mark => mark.type === state.schema.marks.link);

        // 해당 노드가 링크 마크를 가지고 있고, 그 href가 linkTooltip.href와 일치하는지 확인
        if (linkMark &&
            linkMark.attrs.href === linkTooltip.href &&
            linkMark.attrs.id === linkTooltip.id) {
            tr.removeMark(pos, pos + node.nodeSize, state.schema.marks.link);
            linkFound = true;
        }
    });

    if (linkFound) {
        editor.view.dispatch(tr);

        // 링크 툴팁 숨김 처리
        dispatch(setLinkTooltip({ visible: false }));
    }
}