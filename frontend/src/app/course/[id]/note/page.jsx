import CourseNavigationBar from "../../../components/coursenavigation";

export default function NotePage({params}) {
  const courseId = params.id;
  return (
    <div className="text-black flex flex-col items-center
                    min-h-screen bg-white dark:bg-black dark:text-white">
      <div className="w-full max-w-5xl">
        <div className="justify-start">
          <CourseNavigationBar courseId={params.id}/>
        </div>
      </div>

      <div className="text-blue-500 flex flex-col items-center">
        <h2 className="text-5xl">Notes Section</h2>
        <p>This is the Notes page for the {courseId} course.</p>
      </div>
    </div>
  );
}
