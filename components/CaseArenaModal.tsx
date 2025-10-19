import React from 'react';

interface CaseArenaModalProps {
  caseStudy: {
    case_id: string;
    title: string;
    description: string;
    category: string;
    analysis_status: string;
    created_at: string;
  };
  onClose: () => void;
}

const CaseArenaModal: React.FC<CaseArenaModalProps> = ({ caseStudy, onClose }) => {
  return (
    <div>
      <h2>Case Arena Modal</h2>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default CaseArenaModal;