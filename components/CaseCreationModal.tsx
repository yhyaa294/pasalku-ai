import React from 'react';

interface CaseCreationModalProps {
  onSubmit: (caseData: {
    title: string;
    description: string;
    category: string;
    urgency_level: string;
  }) => Promise<void>;
  onClose: () => void;
}

const CaseCreationModal: React.FC<CaseCreationModalProps> = ({ onSubmit, onClose }) => {
  return (
    <div>
      <h2>Case Creation Modal</h2>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default CaseCreationModal;