export default function CoursePage({params}) {
  return (
    <div className="text-black flex flex-col items-center
    min-h-screen bg-white dark:bg-black dark:text-white">
      <p>Course {params.id}</p>
    </div>
  );
}