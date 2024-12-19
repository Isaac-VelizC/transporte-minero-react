import React, { useCallback, useState } from 'react';

interface AccordionItemProps {
  title: string;
  content: string;
  isOpen: boolean;
  onToggle: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = React.memo(({ title, content, isOpen, onToggle }) => {
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

const Accordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = [
    {
      title: 'Elemento 1',
      content: 'Contenido del elemento 1.',
    },
    {
      title: 'Elemento 2',
      content: 'Contenido del elemento 2.',
    },
    {
      title: 'Elemento 3',
      content: 'Contenido del elemento 3.',
    },
  ];

  const handleToggle = useCallback((index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  }, [openIndex]);

  return (
    <div>
      {items.map((item, index) => (
        <AccordionItem 
          key={index} 
          title={item.title} 
          content={item.content} 
          isOpen={openIndex === index} 
          onToggle={() => handleToggle(index)} 
        />
      ))}
    </div>
  );
};

export default Accordion;
