import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const countryCodes = [
  '1', '7', '20', '27', '30', '31', '32', '33', '34', '36', '39', '40', '41', 
  '43', '44', '45', '46', '47', '48', '49', '51', '52', '54', '55', '56', '57', 
  '58', '60', '61', '62', '63', '64', '65', '66', '81', '82', '84', '86', '90', 
  '91', '92', '98', '234', '254', '351', '353', '358', '420', '880', '961', 
  '962', '963', '964', '965', '966', '968', '971', '973', '974'
];

export function PhoneInput({ value, onChange, required }: { value: string, onChange: (val: string) => void, required?: boolean }) {
  const [countryCode, setCountryCode] = React.useState('966');
  const [number, setNumber] = React.useState('');

  React.useEffect(() => {
    if (value) {
      // Find matching country code from value
      const match = countryCodes.find(code => value.startsWith(code + ' '));
      if (match) {
        setCountryCode(match);
        setNumber(value.slice(match.length + 1));
      } else {
        setNumber(value);
      }
    }
  }, [value]);

  const handleCodeChange = (newCode: string) => {
    setCountryCode(newCode);
    onChange(number ? `${newCode} ${number}` : '');
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Strip non-numeric characters
    const newNumber = e.target.value.replace(/\D/g, '');
    
    if (newNumber.length <= 10) {
      setNumber(newNumber);
      onChange(newNumber ? `${countryCode} ${newNumber}` : '');
    }
  };

  return (
    <div className="flex gap-2">
      <div className="w-[100px]">
        <Select value={countryCode} onValueChange={handleCodeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Code" />
          </SelectTrigger>
          <SelectContent className="max-h-[250px]">
            {countryCodes.map((code, i) => (
              <SelectItem key={`${code}-${i}`} value={code}>
                {code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Input
        type="tel"
        className="flex-1"
        value={number}
        onChange={handleNumberChange}
        placeholder="0583214332"
        required={required}
        pattern="[0-9]{10}"
        title="Phone number must be exactly 10 digits"
        maxLength={10}
        minLength={10}
      />
    </div>
  );
}
