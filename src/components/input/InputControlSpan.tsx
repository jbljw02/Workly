import React, { forwardRef } from 'react';

type InputControlSpanProps = {
    label: string;
}

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