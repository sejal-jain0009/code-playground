import { useCallback } from 'react';

const PAIR_MAP = {
  '(': ')',
  '{': '}',
  '[': ']',
  '"': '"',
  "'": "'",
};

const CLOSED_CHARS = new Set(Object.values(PAIR_MAP));

export default function CodeEditor({ id, value, onChange, className, ...rest }) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      const target = e.target;
      const { selectionStart, selectionEnd } = target;

      if (PAIR_MAP[e.key]) {
        e.preventDefault();
        const openChar = e.key;
        const closeChar = PAIR_MAP[openChar];

        const newValue = value.slice(0, selectionStart) + openChar + closeChar + value.slice(selectionEnd);
        onChange({ target: { value: newValue } });

        setTimeout(() => {
          try {
            target.setSelectionRange(selectionStart + 1, selectionStart + 1);
          } catch (err) {
            // ignore if element is unmounted
          }
        }, 0);

        return;
      }

      if (CLOSED_CHARS.has(e.key)) {
        const nextChar = value[selectionStart];
        if (nextChar === e.key && selectionStart === selectionEnd) {
          e.preventDefault();
          setTimeout(() => {
            try {
              target.setSelectionRange(selectionStart + 1, selectionStart + 1);
            } catch (err) {
              // ignore
            }
          }, 0);
        }
      }
    },
    [onChange, value],
  );

  return (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      onKeyDown={handleKeyDown}
      className={className}
      {...rest}
    />
  );
}
