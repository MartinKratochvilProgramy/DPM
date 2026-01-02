import { Modal } from '@mui/material';
import { useState, type ReactNode } from 'react';

interface CardInterface {
  children: ReactNode;
}

const Card: React.FC<CardInterface> = ({ children }) => {

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
        aria-labelledby="stock-chart-modal"
        aria-describedby="show-detailed-stock-chart"
      >
        <div>
          <div className="fixed flex justify-center items-center h-[400px] sm:h-auto transform -translate-y-1/2 sm:-translate-y-0 left-[5vw] right-[5vw] top-1/2 sm:top-[5vh] aspect-auto sm:bottom-[5vh] overflow-y-auto bg-gray-100 dark:bg-[#1e2836] opacity-[0.96] rounded-md border-solid border-[1px] border-blue-400 dark:border-gray-500">
            {children}
          </div>
        </div>
      </Modal>}
    </>
  );
};

export default Card;
