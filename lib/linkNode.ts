import { Mark, mergeAttributes } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { linkClickPlugin, LinkHoverPlugin } from './linkPlugin';
import { LinkTooltip } from '@/redux/features/linkSlice';
import { RawCommands } from '@tiptap/react';

export interface LinkAttributes {
    href: string;
    target?: string | null;
    id?: string | null;
    rel?: string | null;
    class?: string | null;
}

const LinkNode = Mark.create({
    name: 'link',

    addOptions() {
        return {
            openOnClick: true,
            autolink: true,
            defaultProtocol: 'https',
            HTMLAttributes: {},
        };
    },

    addAttributes() {
        return {
            href: {
                default: null,
            },
            target: {
                default: '_blank',
            },
            id: {
                default: null,
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'a[href]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['a', mergeAttributes(HTMLAttributes), 0];
    },

    addCommands() {
        return {
            setLink:
                (attributes: LinkAttributes) =>
                    ({ commands }: { commands: any }) => {
                        return commands.setMark(this.name, attributes);
                    },
            toggleLink:
                (attributes: LinkAttributes) =>
                    ({ commands }: { commands: any }) => {
                        return commands.toggleMark(this.name, attributes);
                    },
            unsetLink:
                () =>
                    ({ commands }: { commands: any }) => {
                        return commands.unsetMark(this.name);
                    },
        } as Partial<RawCommands>;
    },


    addProseMirrorPlugins() {
        const setLinkTooltip = this.options.setLinkTooltip as (payload: Partial<LinkTooltip>) => void;

        return [
            linkClickPlugin,
            LinkHoverPlugin(setLinkTooltip),
        ];
    },
});

export default LinkNode;