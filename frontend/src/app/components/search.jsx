import { useRouter, useSearchParams, usePathname } from "next/navigation";
import GetDjangoApiData from "../constants/getcourses";
import AsyncSelect from 'react-select/async';
import { useTheme } from "next-themes";

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { theme } = useTheme();

  async function HandleSearch(term) {
    const params = new URLSearchParams(searchParams);
    if (term)
    {
      params.set('query', term);
    }
    else
    {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }
  
  const query = searchParams.get('query') || '';

  const loadOptions = async (inputValue) => {
    const apiData = await GetDjangoApiData();

    const filteredData = apiData.filter((course) =>
      course.courses_name.toLowerCase().includes(inputValue.toLowerCase()) ||
      course.courses_id.toLowerCase().startsWith(inputValue.toLowerCase())
    );

    return filteredData.map((course) => ({
      value: course.courses_id,
      label: `${course.courses_id}\t-\t${course.courses_name}`
    }));
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: theme === 'dark' ? (state.isFocused ? "#2C2C2C" : "#1E1E1E") : "#FFFFFF",
      borderColor: state.isFocused ? (theme === 'dark' ? "#565656" : "#CCCCCC") : (theme === 'dark' ? "#333" : "#E0E0E0"),
      color: theme === 'dark' ? "#FFFFFF" : "#000000",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: theme.menuBackground,
      color: theme.menuColor,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? (theme === 'dark' ? "#3E3E3E" : "#F0F0F0") : (theme === 'dark' ? "#2C2C2C" : "#FFFFFF"),
      color: theme === 'dark' ? "#FFFFFF" : "#000000",
      cursor: 'pointer',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: theme.controlColor,
    }),
    placeholder: (provided) => ({
      ...provided,
      color: theme === 'dark' ? "#AAAAAA" : "#777777",
    }),
    input: (provided) => ({
      ...provided,
      color: theme.controlColor,
    }),
  };

  return (
    <div className="mt-8 w-full max-w-6xl">
      <AsyncSelect
        cacheOptions
        loadOptions={loadOptions}
        onChange={(selectedOption) => {
          if (selectedOption) {
            HandleSearch(selectedOption.value); 
          } else {
            HandleSearch('');
          }
        }}
        defaultOptions
        placeholder="ค้นหารายวิชา (ชื่อภาษาอังกฤษ/รหัสวิชา)"
        styles={customStyles}
      />
    </div>
  );
}