import CourseNavigationBar from "../../../components/coursenavigation";
import AddNote from "../../../components/addnote"

export default function NotePage({params}) {
  const courseId = params.id;

  return (
    <div className="text-black flex flex-col
                    min-h-screen bg-white dark:bg-black dark:text-white">
      <div className="w-full max-w-5xl">
        <div className="justify-start">
          <CourseNavigationBar courseId={params.id}/>
        </div>
        <div className="text-success flex flex-col justify-end">
          <AddNote />
        </div>
      </div>
      <div className="text-blue-500 flex flex-col items-center">
        <h2 className="text-5xl">Notes Section</h2>
      </div>
    </div>
  );
}
