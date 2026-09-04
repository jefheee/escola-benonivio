import React from 'react';

interface FormattedTextProps {
  text: string | null | undefined;
  className?: string;
  linkClassName?: string;
}

// Regex to capture URLs starting with http://, https://, or www.
const URL_REGEX = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;

// Trailing punctuation characters that shouldn't be part of the URL
const TRAILING_PUNCTUATION = /[.,;:!?)>"']+$/;

/**
 * Automatically parses text, detects all web URLs,
 * and renders them as secure, styled, clickable hyperlinks.
 */
export default function FormattedText({
  text,
  className = '',
  linkClassName = 'text-blue-600 hover:text-blue-800 underline font-semibold break-all transition-colors',
}: FormattedTextProps) {
  if (!text) return null;

  // Split text by URL regex keeping matches
  const parts = text.split(URL_REGEX);

  return (
    <span className={`whitespace-pre-wrap ${className}`}>
      {parts.map((part, index) => {
        if (!part) return null;

        // Check if the part is a URL
        if (part.match(URL_REGEX)) {
          // Remove any trailing punctuation attached to the link
          const trailingMatch = part.match(TRAILING_PUNCTUATION);
          const trailing = trailingMatch ? trailingMatch[0] : '';
          const cleanUrl = trailing ? part.slice(0, -trailing.length) : part;

          const href = cleanUrl.toLowerCase().startsWith('www.')
            ? `https://${cleanUrl}`
            : cleanUrl;

          return (
            <React.Fragment key={index}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClassName}
                onClick={(e) => e.stopPropagation()}
              >
                {cleanUrl}
              </a>
              {trailing}
            </React.Fragment>
          );
        }

        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
}
