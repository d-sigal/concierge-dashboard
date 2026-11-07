import React, { FC } from 'react';

interface Props {
  text: string;
  highlight: string | null;
}

const TextHighlighter: FC<Props> = ({ text = '', highlight = '' }) => {
  // Ensure text and highlight are strings and not null/undefined
  const safeText = String(text || '');
  const safeHighlight = String(highlight || '');

  // If there's no text to highlight, return the original text
  if (!safeHighlight.trim()) {
    return <span>{safeText}</span>;
  }

  // Escape special characters in the highlight text for regex
  const escapedHighlight = safeHighlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Create a regular expression that matches the highlight text (case-insensitive)
  const regex = new RegExp(`(${escapedHighlight})`, 'gi');

  // Split the text into parts that match and don't match the highlight
  const parts = safeText.split(regex);

  return (
    <span>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <span key={index} className="bg-green-600/20">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </span>
  );
};

export default TextHighlighter;
