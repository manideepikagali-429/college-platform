import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/colleges")
      .then((res) => res.json())
      .then((data) => setColleges(data));
  }, []);

  return (
    <div>
      <h1>College Discovery Platform</h1>

      {colleges.map((college) => (
        <div key={college.id}>
          <h2>{college.name}</h2>
          <Link to={`/college/${college.id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
}

export default Home;