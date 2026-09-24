import React from 'react';

interface AnimatedTextProps {
  text: string;
  as?: keyof React.JSX.IntrinsicElements | any;
  className?: string;
  staggerMs?: number;
  startDelayMs?: number;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  as: Component = 'span',
  className = '',
  staggerMs = 36,
  startDelayMs = 0,
}) => {
  // Use regex to keep space intact but split words
  const words = text.split(' ');

  return (
    <Component className={`animated-text-container ${className}`} aria-label={text}>
      {words.map((word, i) => (
        <React.Fragment key={i}>
          <span aria-hidden="true" style={{ display: 'inline-block' }}>
            <span 
              className="word" 
              style={{ transitionDelay: `${startDelayMs + i * staggerMs}ms` }}
            >
              {word}
            </span>
          </span>
          {i !== words.length - 1 && ' '}
        </React.Fragment>
      ))}
    </Component>
  );
};
