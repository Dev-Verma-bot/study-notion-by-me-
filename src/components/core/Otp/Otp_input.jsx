import React, { useRef, useState } from "react";

const OtpInputs = ({ length = 6, onChange }) => {
  const [values, setValues] = useState(Array(length).fill(""));
  const inputsRef = useRef([]);

  const handleChange = (index, value) => {
    // ✅ take only the last digit if multiple chars are entered
    let digit = value.slice(-1);

    // ✅ allow only digits 0–9
    if (!/^\d?$/.test(digit)) return;

    const newValues = [...values];
    newValues[index] = digit;
    setValues(newValues);

    const otpString = newValues.join("");
    onChange(otpString);

    // ✅ auto-focus next if digit entered
    if (digit && index < length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <div className="flex justify-around w-full items-center ">
      {values.map((val, i) => (
        <input
          key={i}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={val}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          ref={(el) => (inputsRef.current[i] = el)}
          className="bg-white rounded-md border-none w-[50px] h-[60px]
           text-black text-center text-[30px]"
        />
      ))}
    </div>
  );
};

export default OtpInputs;
