interface InputProps {
    label: string;
    value?: string;
    action: (value: string) => void;
  }
  
  export default function Input({ label, value, action }: InputProps) {
    return (
      <div className="mb-4">
        <label className="block text-textPrimary text-sm mb-1 break-all">{label}:</label>
        <input
          type="text"
          className="w-full py-2 pl-4 text-sm text-textPrimary rounded border border-neutral focus:outline-none focus:border-neutralDark"
          value={value}
          onChange={(e) => {
            action(e.target.value);
          }}
        />
      </div>
    );
  }