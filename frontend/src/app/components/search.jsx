"use-client"

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import GetDjangoApiData from "../constants/getcourses";
import AsyncSelect from 'react-select/async';
import { useTheme } from "next-themes";
import { useEffect, useState } from 'react';

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      course.course_name.toLowerCase().includes(inputValue.toLowerCase()) || 
      course.courseID.toLowerCase().startsWith(inputValue.toLowerCase())
    );

    return filteredData.map((course) => ({
      value: course.courseID,
      label: `${course.courseID}\t-\t${course.course_name}`
    }));
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: theme === 'dark' ? (state.isFocused ? "#2C2C2C" : "#1E1E1E") : "#FFFFFF",
      borderColor: state.isFocused ? (theme === 'dark' ? '#888888' : 'rgb(209 213 219)') : (theme === 'dark' ? '#555555' : '#CCCCCC'),
      color: theme === 'dark' ? "#FFFFFF" : "#000000",
      height: '3rem',
      boxShadow: state.isFocused ? '0 0 0 1px #888888' : null,
      '&:hover': {
        borderColor: state.isFocused ? (theme === 'dark' ? '#888888' : 'rgb(209 213 219)') : '#999999',
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: theme === 'dark' ? "#2C2C2C" : "#FFFFFF",
      color: theme === 'dark' ? "#FFFFFF" : "#000000",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? (theme === 'dark' ? "#3E3E3E" : "#F0F0F0") : (theme === 'dark' ? "#2C2C2C" : "#FFFFFF"),
      color: theme === 'dark' ? "#FFFFFF" : "#000000",
      cursor: 'pointer',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: theme === 'dark' ? "#FFFFFF" : "#000000"
    }),
    placeholder: (provided) => ({
      ...provided,
      color: theme === 'dark' ? "#AAAAAA" : "#777777",
    }),
    input: (provided) => ({
      ...provided,
      color: theme === 'dark' ? "#FFFFFF" : "#000000"
    }),
  };

  if (!mounted) return null;

  return (
    <div className="my-2 w-full max-w-5xl mx-auto">
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