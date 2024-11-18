import React from "react";
import { useState } from "react";

interface Props{
    OnText: string,
    OffText: string,
    isOn: boolean,
    onSwitch: ()=>void,
};

const SwitchButton: React.FC<Props> = ({OnText, OffText, isOn, onSwitch}) => {

  return (
    <div className="flex items-center space-x-4 mb-10">
      <div
        onClick={onSwitch}
        className={`w-14 h-8 flex items-center cursor-pointer rounded-full p-1 transition-colors ${
          isOn ? 'bg-green-500' : 'bg-gray-300'
        }`}
      >
        <div
          className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
            isOn ? 'translate-x-6' : 'translate-x-0'
          }`}
        ></div>
      </div>
      <span className="text-lg font-medium">
        {isOn ? OnText : OffText}
      </span>
    </div>
  );
};

export default SwitchButton;
