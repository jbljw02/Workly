import { Plugin, PluginKey } from 'prosemirror-state';
import { Extension } from '@tiptap/core';
import { LinkTooltip } from '@/redux/features/linkSlice';

// 링크 위에 마우스를 올렸을 때의 동작을 제어하는 플러그인
const LinkHoverPlugin = (setLinkTooltip: (payload: LinkTooltip) => void) => {
    return new Plugin({
        key: new PluginKey('linkHover'),
        props: {
            handleDOMEvents: {
                mouseover(view, event) {
                    const target = event.target as HTMLElement;
                    // 마우스가 올라간 태그가 링크일 시
                    if (target.nodeName === 'A') {
                        // 태그의 href와 위치를 찾음
                        const href = target.getAttribute('href') || '';
                        const rect = target.getBoundingClientRect();

                        // linkTooltip의 상태를 업데이트
                        setLinkTooltip({
                            href: href,
                            position: {
                                top: rect.top + window.scrollY,
                                left: rect.left + window.scrollX,
                            },
                            visible: true,
                        });
                    }

                    return false;
                },
                // mouseout(view, event) {
                //     const target = event.target as HTMLElement;

                //     if (target.nodeName === 'A') {
                //         setLinkTooltip({
                //             href: '',
                //             position: { top: 0, left: 0 },
                //             visible: false,
                //         });
                //     }

                //     return false;
                // },
            },
        },
    });
};

const LinkNode = Extension.create({
    name: 'LinkNode',

    addProseMirrorPlugins() {
        const setLinkTooltip = this.options.setLinkTooltip as (payload: LinkTooltip) => void;

        return [
            LinkHoverPlugin(setLinkTooltip),
        ];
    },
});

export default LinkNode;