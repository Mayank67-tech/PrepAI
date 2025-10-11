import React from 'react'
import { X } from "lucide-react";
function Modal({children ,isOpen,onClose,title,hideHeader}) {
  
    if(!isOpen) return null;
  
    return (
    <>
    <div className="fixed inset-0 z-50 flex justify-center items-center  text-black">
    <div className="relative flex flex-col bg-white
    shadow-lg rounded-lg overflow-hidden w-100 p-4 ">
  

            {/* header */}
            {!hideHeader && (
                <div className="">
                <h3 className="">{title}</h3>
                </div>
            )}

        <div className='flex justify-end '>
        <button
        type="button"
        onClick={onClose}
        className="text-gray-400 hover:text-red-500  w-5 mr-1 mt-1 "

        >
        <X className="w-full h-full"  />
        </button>
        </div>


        
        {/*body scrollable */}

        <div className='custom-scrollbar'>
        {children}

        </div>
   </div>
  
   </div>

    </>
  )
}

export default Modal