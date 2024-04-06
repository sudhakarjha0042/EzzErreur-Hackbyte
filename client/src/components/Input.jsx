import React, { forwardRef, useState, useMemo, useContext } from "react";
import { cva } from "class-variance-authority";

const Input = forwardRef(
  (
    {
      isFocused,
      hasError,
      className,
      type,
      value,
      variant: InputVariant,
      ...props
    },
    ref
  ) => {
    // getting current selected mode
    // const { selectedMode } = useContext(switchMode);

    // checking if it is a login page as not to show dark mode in login page for now
    // keeping normal styles for login page
    const urlParams = window?.location?.href?.split("/");
    const currentPage = urlParams[urlParams.length - 1];

    const inputVariants = cva(
      `block focus:outline-none text-base ${"placeholder:text-neutral-500 text-neutral-900"}  border-2 rounded-lg`,
      {
        variants: {
          variant: {
            default: "border-primary-100 bg-neutral-50",
            primary: "border-primary-200 bg-neutral-50",
            secondary: "border-neutral-300 bg-neutral-50",
            file: `text-sm border-2 border-primary-200 rounded-md
                     file:mr-4 file:py-0 file:px-4 file:py-1
                      file:rounded-full file:border-2 file:border-borderPrimary
                      file:text-[16px] file:font-light
                        file:bg-borderPrimary file:text-dark-border
                        hover:file:bg-violet-100
                        file:cursor-pointer
          `,
            darkDefault: "border-dark-border bg-dark-primary",
            darkPrimary: "border-dark-border bg-dark-primary",
            darkSecondary: "border-dark-border bg-dark-primary",
            darkFile: `text-sm border-2 border-dark-border bg-dark-primary rounded-md
                     file:mr-4 file:py-0 file:px-4 file:py-1
                      file:rounded-full file:border-2 file:border-dark-border
                      file:text-[16px] file:font-light
                        file:bg-dark-secondary file:text-neutral-200
                        file:cursor-pointer
          `,
          },
          size: {
            default: " w-full px-3 py-3 ",
          },
        },
        defaultVariants: {
          variant: "default",
          size: "default",
        },
      }
    );
    const variant =
      type !== "file"
        ? hasError && !isFocused
          ? "default"
          : InputVariant
          ? InputVariant
          : "primary"
        : "darkFile";
    const [showPassword, setShowPassword] = useState(false);
    useMemo(() => {
      if (type !== "file" && value.length === 0 && type === "password") {
        setShowPassword(false);
      }
    }, [value]);

    return (
      <div className="relative">
        <input
          type={
            type === "password" ? (!showPassword ? "password" : "text") : type
          }
          required
          value={value}
          {...props}
        />

        {type === "password" && value.length > 0 && (
          <span className="absolute p-2 cursor-pointer top-2 right-4">
            {showPassword ? (
              <img
                className=""
                onClick={() => setShowPassword(!showPassword)}
              />
            ) : (
              <img
                className=""
                onClick={() => setShowPassword(!showPassword)}
              />
            )}
          </span>
        )}
      </div>
    );
  }
);

export const Label = ({ name, htmlFor }) => {
  // getting current selected mode
  //   const { selectedMode } = useContext(switchMode);

  return (
    <label className="block" htmlFor={htmlFor}>
      <span className={`${"text-neutral-50"} font-normal text-[16px] my-[3px]`}>
        <p>{name}</p>
      </span>
    </label>
  );
};

export const TextArea = ({ className, ...props }) => {
  // getting current selected mode
  //   const { selectedMode } = useContext(switchMode);
  return <textarea {...props} />;
};

export default Input;
