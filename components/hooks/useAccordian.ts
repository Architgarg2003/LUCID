import { useState } from 'react';

type AccordionIndex = number | null;

const useAccordion = (init: number = 0): [AccordionIndex, (index: number) => void] => {
  const [activeIndex, setActiveIndex] = useState<AccordionIndex>(init);

  const handleAccordion = (index: number): void => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return [activeIndex, handleAccordion];
};

export default useAccordion;