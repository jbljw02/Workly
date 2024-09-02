import { Plugin, PluginKey } from 'prosemirror-state';
import { Extension } from '@tiptap/core';
import { LinkTooltip } from '@/redux/features/linkSlice';

// 링크 위에 마우스를 올렸을 때
export const LinkHoverPlugin = (setLinkTooltip: (payload: Partial<LinkTooltip>) => void) => {
    return new Plugin({
        key: new PluginKey('linkHover'),
        view() {
            const mouseMove = (event: MouseEvent) => {
                // 현재 마우스가 있는 곳(a 태그가 될 수도, 다른 태그가 될 수도)
                const target = event.target as HTMLElement;
                
                let id = target.id || ''; 
                let href = target.getAttribute('href') || ''; 
                let text = target.textContent || '';
                let visible = false;
                let position = { top: 0, left: 0 };
                
                // 타겟이 a태그일 경우
                if (target.nodeName === 'A') {
                    id = target.getAttribute('id') || '';
                    href = target.getAttribute('href') || '';
                    text = target.textContent || '';
                    // 태그의 위치를 구해서 position에 할당
                    const rect = target.getBoundingClientRect();
                    position = {
                        top: rect.top + window.scrollY,
                        left: rect.left + window.scrollX,
                    };
                    visible = true; // 툴팁이 보이도록 
                }

                // 툴팁의 정보를 가져옴
                const tooltipElement = document.querySelector('.link-tooltip');

                // 툴팁 요소가 타겟을 포함하고 있지 않으며, a 태그가 존재하지 않을 때 툴팁 닫기
                if (tooltipElement &&
                    !tooltipElement.contains(event.target as Node) &&
                    !target.closest('a')) {
                    setLinkTooltip({
                        visible: false,
                    });
                }
                // 툴팁 혹은 링크 위에 마우스가 올라갔을 때
                else if (visible) {
                    setLinkTooltip({
                        id,
                        href,
                        text,
                        position,
                        visible: true,
                    });
                }
            };

            document.addEventListener('mousemove', mouseMove);

            return {
                destroy() {
                    document.removeEventListener('mousemove', mouseMove);
                }
            };
        }
    });
};

// 링크를 클릭했을 때
export const linkClickPlugin = new Plugin({
    key: new PluginKey('linkHandler'),
    props: {
        handleClickOn(view, pos, node, nodePos, event) {
            const target = event.target as HTMLElement;
            if (target.tagName === 'A' && target.getAttribute('href')) {
                const href = target.getAttribute('href');
                if (href) {
                    // 기본 링크 클릭 동작 수행
                    window.open(href, target.getAttribute('target') || '_blank');
                    return true; // ProseMirror가 더 이상 이벤트를 처리하지 않도록 함
                }
            }
            return false; // 기본 ProseMirror 클릭
        },
    },
});