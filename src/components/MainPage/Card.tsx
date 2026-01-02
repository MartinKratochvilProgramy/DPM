import { Modal, modalClasses } from '@mui/material';
import { useState, type ReactNode } from 'react';

interface CardInterface {
  children: ReactNode;
  modalClassName: string;
}

const Card: React.FC<CardInterface> = ({ children, modalClassName }) => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="card-shadow hover:bg-opacity-10 dark:hover:bg-opacity-[0.02] hover:bg-red-100 w-[290px] md:w-[460px] aspect-[1.2] flex items-center justify-center rounded-md sm:rounded-lg border border-blue-400 dark:border-gray-500 cursor-pointer"
      >
        {children}
      </div>

      {isOpen && <Modal
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        aria-labelledby="modal"
        aria-describedby="show-detailed-modal"
      >
        <div>
          <div className={modalClassName}>
            {children}
          </div>
        </div>
      </Modal>}
    </>
  );
};

export default Card;
