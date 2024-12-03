import React, {useState} from "react";
import {faculties} from "../constants/index";

export default function ReviewFilters({ filters, setFilters, onApplyFilters, professors }) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear() + 543);
  
  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex justify-center space-x-4 my-4">
      <div>
        <label className="block text-sm font-medium">คณะ</label>
        <select
          value={filters.faculties || ""}
          onChange={(e) => handleChange("faculties", e.target.value)}
          className="border rounded p-2"
        >
          <option value="">ทั้งหมด</option>
          {faculties.map((faculty, index) => (
            <option key={index} value={faculty}>
              {faculty}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">ความพึงพอใจ</label>
        <select
          value={filters.rating || ""}
          onChange={(e) => handleChange("rating", e.target.value)}
          className="border rounded p-2"
        >
          <option value="">ทั้งหมด</option>
          <option value="5">5</option>
          <option value="4">4</option>
          <option value="3">3</option>
          <option value="2">2</option>
          <option value="1">1</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">ปีการศึกษา</label>
        <input
          type="number"
          value={filters.year || currentYear}
          onChange={(e) => handleChange("year", e.target.value)}
          className="border rounded p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">เกรด</label>
        <select
          value={filters.grades || ""}
          onChange={(e) => handleChange("grades", e.target.value)}
          className="border rounded p-2"
        >
          <option value="">ทั้งหมด</option>
          {['A', 'B', 'C', 'D', 'F', 'W'].map((grade, index) => (
            <option key={index} value={grade}>
              {grade}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">อาจารย์</label>
        <select
          value={filters.professor || ""}
          onChange={(e) => handleChange("professor", e.target.value)}
          className="border rounded p-2"
        >
          <option value="">ทั้งหมด</option>
          {professors.map((professor, index) => (
            <option key={index} value={professor}>
              {professor}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">เกณฑ์</label>
        <select
          value={filters.criteria || ""}
          onChange={(e) => handleChange("criteria", e.target.value)}
          className="border rounded p-2"
        >
          <option value="">ทั้งหมด</option>
          <option value="work-based">Work-Based</option>
          <option value="exam-based">Exam-Based</option>
          <option value="project-based">Project-Based</option>
          <option value="balance">Balance</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">เรียนแบบ</label>
        <select
          value={filters.type || ""}
          onChange={(e) => handleChange("type", e.target.value)}
          className="border rounded p-2"
        >
          <option value="">ทั้งหมด</option>
          <option value="onsite">Onsite</option>
          <option value="online">Online</option>
          <option value="hybrid">Hybrid</option>
        </select>
      </div>
    </div>
  );
}
