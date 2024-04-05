interface InputProps {
  className?: string;
  placeholder?: string;
  type: string;
  name: string;
  hidden?: boolean;
  required?: boolean;
  defaultValue?: string;
}

export function Input({
  className,
  placeholder,
  type,
  name,
  hidden,
  required,
  defaultValue,
}: InputProps) {
  return (
    <input
      className={`input p-3 rounded-xl w-80 md:w-96 text-[#512602] placeholder:text-[#512602] ${className}`}
      placeholder={placeholder}
      type={type}
      name={name}
      hidden={hidden}
      required={required}
      defaultValue={defaultValue}
    />
  );
}
