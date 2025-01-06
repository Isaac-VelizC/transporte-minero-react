import React from 'react';

interface AccordionItemProps {
  title: string;
  content: string;
  isOpen: boolean;
  onToggle: () => void;
}

export const AccordionItem: React.FC<AccordionItemProps> = React.memo(({ title, content, isOpen, onToggle }) => {
  return (
    <div className="border-b">
      <div 
        className="flex justify-between items-center p-4 cursor-pointer"
        onClick={onToggle}
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        <span>{isOpen ? '-' : '+'}</span>
      </div>
      {isOpen && (
        <div className="p-4 bg-gray-100">
          <p>{content}</p>
        </div>
      )}
    </div>
  );
});

