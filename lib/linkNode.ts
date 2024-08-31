import { Plugin, PluginKey } from 'prosemirror-state';
import { Extension } from '@tiptap/core';
import { LinkTooltip } from '@/redux/features/linkSlice';

const LinkHoverPlugin = (setLinkTooltip: (payload: Partial<LinkTooltip>) => void) => {
    return new Plugin({
        key: new PluginKey('linkHover'),
        view() {
            const mouseMove = (event: MouseEvent) => {
                 // 현재 마우스가 있는 곳(a 태그가 될 수도, 다른 태그가 될 수도)
                const target = event.target as HTMLElement;
                let href = '';
                let visible = false;
                let position = { top: 0, left: 0 };

                // 타겟이 a태그일 경우
                if (target.nodeName === 'A') {
                    href = target.getAttribute('href') || ''; // 링크 URL을 할당
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
                        href,
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

const LinkNode = Extension.create({
    name: 'LinkNode',

    addProseMirrorPlugins() {
        const setLinkTooltip = this.options.setLinkTooltip as (payload: Partial<LinkTooltip>) => void;

        return [
            LinkHoverPlugin(setLinkTooltip),
        ];
    },
});

export default LinkNode;