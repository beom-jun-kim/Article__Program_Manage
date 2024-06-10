import React from 'react';
import { IoMdClose } from "react-icons/io";

interface Props {
  children: React.ReactNode;
  onClose: () => void;
}

const Popup: React.FC<Props> = ({ children, onClose }) => {
  //배경 클릭시 닫힘
  const handleBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-10' onClick={handleBackgroundClick}>
      <div className='bg-white p-5 rounded-lg max-w-sm w-11/12 mx-auto'>
        <div className='flex justify-end'>
          <button onClick={onClose}><IoMdClose size={25} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Popup;