import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import GetDjangoApiData from "../constants/getcourses";
import AsyncSelect from 'react-select/async';

export default function Search() {
  const [data, setData] = useState([]);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

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
      course.course_id.toLowerCase().startsWith(inputValue.toLowerCase())
    );

    return filteredData.map((course) => ({
      value: course.course_id,
      label: `${course.course_id}\t-\t${course.course_name}`
    }));
  };

  // useEffect(() => {
  //   async function fetchData() {
  //     const apiData = await GetDjangoApiData();
  //     if (query)
  //     {
  //       const filteredData = apiData.filter((course) => {
  //         return course.course_name.toLowerCase().includes(query.toLowerCase()) || course.course_id.toLowerCase().startsWith(query.toLowerCase());
  //       });
  //       setData(filteredData);
  //     }
  //     else
  //     {
  //       setData(apiData);
  //     }
  //   }
  //   fetchData();
  // }, [query]);

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
      />
      {/* <input
      type="text"
      placeholder="ค้นหารายวิชา (ชื่อภาษาอังกฤษ/รหัสวิชา)"
      className="w-full h-12 px-4 py-2 text-gray-700 dark:text-white rounded-md border border-gray-300 focus:outline-none focus:border-2"
      onChange={(e) => {
        HandleSearch(e.target.value);
      }}
      defaultValue={searchParams.get('query')?.toString()}
      /> */}
      {/* <Select
        options={data.map((course) => ({
          value: course.course_id,
          label: `${course.course_id} ${course.course_name}`
        }))}
        onChange={(values) => {
          const selectedValue = values[0]?.value || '';
          HandleSearch(selectedValue);
        }}
        placeholder="ค้นหารายวิชา (ชื่อภาษาอังกฤษ/รหัสวิชา)"
        searchable
        noDataLabel="ไม่พบข้อมูล"
        defaultValue={searchParams.get('query')?.toString()}
      /> */}
      {/* <div>
        {data.map((course) => (
          <pre style={{ tabSize: 2 }}>{course.course_id}    {course.course_name}</pre>
        ))}
      </div> */}
    </div>
    
  );
}