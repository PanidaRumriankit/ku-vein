"use client";

import {useEffect} from "react";
import MakeFilterApiRequest from "../../constants/getfilterreview";

export default function ReviewPage({params}) {

  useEffect(() => {
    const fetchReviews = async () => {
      const data = await MakeFilterApiRequest("latest", params.id, "review");
    };

    fetchReviews().then(() => {console.log("Fetch Success")});
  }, [params.id]);

  return (
    <p>
      {params.id}
    </p>
  );
}
