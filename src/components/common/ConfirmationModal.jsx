import React from "react";
import Icon_button from "./Icon_button";  // make sure your Icon_button expects onClick prop

const ConfirmationModal = ({ modal_data }) => {
  return (
    <div className="fixed inset-0 z-[1000] grid place-items-center overflow-auto bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="w-11/12 max-w-[350px] rounded-lg border border-richblack-400 bg-richblack-800 p-6">
        <p className="text-2xl font-semibold text-richblack-5">{modal_data?.text1}</p>
        <p className="mt-3 mb-5 leading-6 text-richblack-200">{modal_data?.text2}</p>
        <div className="flex items-center gap-x-4 justify-end">
          <Icon_button
            onClick={modal_data?.button1_handler}
            text={modal_data?.button1_text}
            className="px-4 py-2 bg-richblack-600 rounded hover:bg-richblack-500"
          />
          <button
            onClick={modal_data?.button2_handler}
            className="cursor-pointer rounded-md bg-richblack-200 py-2 px-5 font-semibold text-richblack-900 hover:bg-richblack-300"
          >
            {modal_data?.button2_text}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
