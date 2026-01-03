const Icon_button = ({
  text,
  onClick,
  children,
  disabled,
  outline = false,
  customClasses = "",
  type = "button",
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={`flex items-center gap-2 rounded-md px-4 py-2 font-semibold transition-all duration-200 
        ${
          outline
            ? "border border-yellow-100 text-yellow-100 hover:bg-yellow-100 hover:text-black"
            : "bg-yellow-100 text-black hover:bg-yellow-200"
        } 
        ${customClasses}`}
    >
      {children ? (
        <>
          <span>{text}</span>
          {children}
        </>
      ) : (
        text
      )}
    </button>
  );
};

export default Icon_button;
