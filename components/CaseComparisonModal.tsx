import React from 'react';

interface CaseComparisonModalProps {
  caseIds: string[];
  onClose: () => void;
}

const CaseComparisonModal: React.FC<CaseComparisonModalProps> = ({ caseIds, onClose }) => {
  return (
    <div>
      <h2>Case Comparison Modal</h2>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default CaseComparisonModal;