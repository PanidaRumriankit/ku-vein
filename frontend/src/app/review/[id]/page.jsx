import {useEffect} from "react";
import MakeFilterApiRequest from "@/app/constants/getfilterreview";

export default function ReviewPage({params}) {

  useEffect(() => {
    const fetchReviews = async () => {
      const data = await MakeFilterApiRequest("latest", params.id, "review");
      console.log( );
    };

    fetchReviews()
  }, [params.id, selectedKeys]);

  return (
    <p>
      {params.id}
    </p>
  );
}
