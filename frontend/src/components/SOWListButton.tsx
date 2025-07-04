import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ListButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => navigate('/sow-list')}
      variant="outline"
      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
    >
      Generated SOWs
    </Button>
  );
};

export default ListButton;
