interface InputProps {
  label?: string;
  value?: string;
  action: (value: string) => void;
  defaultDisable?: boolean;
  property?: { [key: string]: any };
}

export default function Input({
  label = '',
  value,
  action,
  defaultDisable = false,
  property,
}: InputProps) {
  return (
    <div className='mb-4'>
      <label className='block text-textPrimary text-sm mb-1 break-all'>
        {label}
        {label ? ':' : ''}
      </label>
      <input
        type='text'
        className='w-full py-2 px-2 text-sm text-textPrimary rounded border border-neutral focus:outline-none focus:border-neutralDark'
        value={value}
        onChange={(e) => {
          action(e.target.value);
        }}
        disabled={defaultDisable}
        {...property}
        required
      />
    </div>
  );
}
