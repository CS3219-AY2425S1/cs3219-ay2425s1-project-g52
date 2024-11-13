import Select from "react-select";
import { languageMap } from "./languageMap"; // Import the language map

interface LanguageDropdownProps {
  selectedLanguage: number; // The currently selected language ID
  onSelectChange: (selectedLanguage: number) => void;
}

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({ selectedLanguage, onSelectChange }) => {
  const languageOptions = Object.entries(languageMap).map(([id, lang]) => ({
    value: Number(id),
    label: lang.name,
  }));

  return (
    <Select
      value={languageOptions.find(option => option.value === selectedLanguage)} // Set the currently selected language
      options={languageOptions}
      onChange={(selectedOption) => onSelectChange(selectedOption?.value ?? 100)} // Default to Python (ID: 100)
      placeholder="Select a Language"
    />
  );
};

export default LanguageDropdown;
