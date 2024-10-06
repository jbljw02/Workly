import React, { forwardRef } from 'react';

type InputControlSpanProps = {
    label: string;
}

// input의 글자수에 따른 크기에 따라 크기를 조절
const InputControlSpan = forwardRef<HTMLSpanElement, InputControlSpanProps>(
    ({ label }, ref) => {
        return (
            <span
                ref={ref}
                className="invisible absolute whitespace-nowrap">
                {label}
            </span>
        )
    }
);

InputControlSpan.displayName = 'InputControlSpan';

export default InputControlSpan;