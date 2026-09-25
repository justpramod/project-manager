import { useState } from "react";

const InputField = ({ label, type, placeholder, value, onChange, isPassword }) => {

  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="mb-4 ">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>


      <div className="relative flex">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}

            className=" text-gray-400 hover:text-gray-600 focus:outline-none absolute right-3 top-1/2 -translate-y-1/2"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >

            <span className="text-lg">
              {showPassword ? <svg xmlns="http://www.w3.org/2000/svg"
                width="24" height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M3 3l18 18" />
                <path d="M10.6 5.1A10.7 10.7 0 0 1 12 5c6.5 0 10 7 10 7a17.4 17.4 0 0 1-3.1 4.1" />
                <path d="M6.7 6.7C3.8 8.6 2 12 2 12s3.5 7 10 7c1.7 0 3.2-.4 4.5-1" />
              </svg>
                : 
                <svg xmlns="http://www.w3.org/2000/svg"
                  width="24" height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>}
            </span> </button>)
        }

      </div>
    </div>
  );
}

export default InputField;
