import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function Detail() {
  const { id } = useParams();
  const [college, setCollege] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/colleges/${id}`)
      .then((res) => res.json())
      .then((data) => setCollege(data));
  }, [id]);

  if (!college) return <p>Loading...</p>;

  return (
    <div>
      <h1>{college.name}</h1>
      <p>Location: {college.location}</p>
      <p>Fees: ₹{college.fees}</p>
      <p>Rating: {college.rating}</p>
      <p>Placement: {college.placement}</p>
    </div>
  );
}

export default Detail;