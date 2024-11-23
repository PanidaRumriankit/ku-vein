"use client"

import {useSearchParams} from "next/navigation";
import {facultyColor} from "../constants/index";
import AsyncSelect from 'react-select/async';
import {useTheme} from "next-themes";
import {useEffect, useState} from 'react';

export default function SearchFaculty({ onFacultySelect }) {
  const searchParams = useSearchParams();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const query = searchParams.get('query') || '';

  const loadOptions = async (inputValue) => {

    const filteredData = facultyColor.filter((faculty) =>
      faculty.name.toLowerCase().includes(inputValue.toLowerCase())
    );

    return filteredData.map((faculty) => ({
      value: faculty.name,
      label: `${faculty.name}`,
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
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
      fontFeatureSettings: '"tnum" on, "lnum" on',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: theme === 'dark' ? "#FFFFFF" : "#000000",
      fontFamily: 'Inter, sans-serif',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: theme === 'dark' ? "#AAAAAA" : "#777777",
    }),
    input: (provided) => ({
      ...provided,
      color: theme === 'dark' ? "#FFFFFF" : "#000000",
    }),
  };
  

  if (!mounted) return null;

  return (
    <div className="my-2 w-full max-w-5xl mx-auto">
      <AsyncSelect
        cacheOptions
        loadOptions={loadOptions}
        onChange={(selectedOption) => {
          if (onFacultySelect) {
            onFacultySelect(selectedOption ? {
              name: selectedOption.value,
            } : null);
          }
        }}
        defaultOptions
        placeholder="คณะ"
        styles={customStyles}
      />
    </div>
  );
}