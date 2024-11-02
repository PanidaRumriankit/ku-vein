"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import GetDjangoApiData from "../constants/getcourses";
import AsyncSelect from 'react-select/async';
import { useTheme } from "next-themes";
import { useEffect, useState } from 'react';

export function handleSearch(term, searchParams, pathname, replace) {
  const params = new URLSearchParams(searchParams);

  if (term) {
    params.set('query', term);
  } else {
    params.delete('query');
  }

  replace(`${pathname}?${params.toString()}`);
}

export default function Search({ onCourseSelect, page }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadOptions = async (inputValue) => {
    const apiData = await GetDjangoApiData();

    if (!selectedFaculty) {
      if (inputValue) {
        const filteredCourses = apiData.filter(course =>
          course.courses_name.toLowerCase().includes(inputValue.toLowerCase()) ||
          course.courses_id.toLowerCase().startsWith(inputValue.toLowerCase())
        );

        return filteredCourses.map(course => ({
          value: course.courses_id,
          label: `${course.courses_id} - ${course.courses_name}`,
          courses_type: course.courses_type,
          faculty: course.faculties,
          isFaculty: false
        }));
      } else {
        const faculties = Array.from(new Set(apiData.map(course => course.faculties || "Undefined")));
        return faculties.map(faculty => ({
          value: faculty,
          label: faculty,
          isFaculty: true
        }));
      }
    } else {
      const filteredCourses = apiData.filter(course =>
        course.faculties === selectedFaculty &&
        (course.courses_name.toLowerCase().includes(inputValue.toLowerCase()) ||
         course.courses_id.toLowerCase().startsWith(inputValue.toLowerCase()))
      );

      return filteredCourses.map(course => ({
        value: course.courses_id,
        label: `${course.courses_id} - ${course.courses_name}`,
        courses_type: course.courses_type,
        faculty: course.faculties,
        isFaculty: false
      }));
    }
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

  const handleChange = async (selectedOption) => {
    if (selectedOption.isFaculty) {
      setSelectedFaculty(selectedOption.value);
      await loadOptions("");
    } else {
      if (page === 'page') {
        handleSearch(selectedOption.value, searchParams, pathname, replace);
      }
      if (onCourseSelect) {
        onCourseSelect({
          courses_id: selectedOption.value,
          courses_type: selectedOption.courses_type,
          faculties: selectedOption.faculties
        });
      }
    }
  };

  if (!mounted) return null;

  return (
    <div className="my-2 w-full max-w-5xl mx-auto">
      <AsyncSelect
        key={selectedFaculty || "faculty-select"}
        cacheOptions
        loadOptions={loadOptions}
        onChange={handleChange}
        onBlur={() => setSelectedFaculty(null)}
        defaultOptions
        placeholder="ค้นหารายวิชา (ชื่อภาษาอังกฤษ/รหัสวิชา)"
        styles={customStyles}
      />
    </div>
  );
}
