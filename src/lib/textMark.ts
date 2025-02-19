import { Mark } from '@tiptap/core'

const CustomTextMark = Mark.create({
    name: 'customText',

    // span 태그로 렌더링
    renderHTML() {
        return ['span', { class: 'custom-text' }, 0]
    },

    // span 태그를 파싱
    parseHTML() {
        return [
            {
                tag: 'span.custom-text',
            },
        ]
    },
})

export default CustomTextMark;