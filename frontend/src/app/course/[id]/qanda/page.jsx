import CourseNavigationBar from "../../../components/coursenavigation";

export default function QuestionAndAnswerPage({params}) {
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
        <h2 className="text-5xl">Q&A Section</h2>
        <p>This is the Q&A page for the {courseId} course.</p>
      </div>
    </div>
  );
}