import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [colleges, setColleges] = useState([]);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [sortOption, setSortOption] = useState("");

  const [selected, setSelected] = useState([]);
  const [details, setDetails] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const collegesPerPage = 3;

  useEffect(() => {
    fetch("https://YOUR-RENDER-BACKEND-URL.onrender.com/api/colleges")
      .then((res) => res.json())
      .then((data) => {
        console.log("College data from backend:", data);
        setColleges(data);
      })
      .catch((err) => console.log("Error fetching colleges:", err));
  }, []);

  // Search + location filter
  let displayedColleges = colleges.filter((college) => {
    const nameMatch =
      search === "" ||
      college.name.toLowerCase().includes(search.toLowerCase());

    const locationMatch =
      location === "" ||
      college.location.toLowerCase().includes(location.toLowerCase());

    return nameMatch && locationMatch;
  });

  // Sorting
  if (sortOption === "feesLow") {
    displayedColleges = [...displayedColleges].sort((a, b) => a.fees - b.fees);
  }

  if (sortOption === "feesHigh") {
    displayedColleges = [...displayedColleges].sort((a, b) => b.fees - a.fees);
  }

  if (sortOption === "ratingHigh") {
    displayedColleges = [...displayedColleges].sort(
      (a, b) => b.rating - a.rating
    );
  }

  if (sortOption === "nameAZ") {
    displayedColleges = [...displayedColleges].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  // Pagination logic
  const totalPages = Math.ceil(displayedColleges.length / collegesPerPage);

  const startIndex = (currentPage - 1) * collegesPerPage;
  const endIndex = startIndex + collegesPerPage;

  const paginatedColleges = displayedColleges.slice(startIndex, endIndex);

  const handleCompare = (college) => {
    const alreadySelected = selected.find((c) => c._id === college._id);

    if (alreadySelected) {
      setSelected(selected.filter((c) => c._id !== college._id));
    } else {
      if (selected.length < 3) {
        setSelected([...selected, college]);
      } else {
        alert("You can compare only 3 colleges");
      }
    }
  };

  const resetAll = () => {
    setSearch("");
    setLocation("");
    setSortOption("");
    setCurrentPage(1);
  };

  return (
    <div className="container">
      <h1>College Discovery Platform</h1>

      <p className="subtitle">
        Search, sort, view details, and compare colleges.
      </p>

      <div className="filters">
        <input
          type="text"
          placeholder="Search college name"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <input
          type="text"
          placeholder="Filter by location"
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            setCurrentPage(1);
          }}
        />

        <select
          value={sortOption}
          onChange={(e) => {
            setSortOption(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">Sort Colleges</option>
          <option value="feesLow">Fees: Low to High</option>
          <option value="feesHigh">Fees: High to Low</option>
          <option value="ratingHigh">Rating: High to Low</option>
          <option value="nameAZ">Name: A to Z</option>
        </select>

        <button onClick={resetAll}>Reset</button>
      </div>

      <h2>College List</h2>

      <p className="result-count">
        Showing {displayedColleges.length} colleges
      </p>

      <div className="grid">
        {paginatedColleges.length > 0 ? (
          paginatedColleges.map((college) => (
            <div className="card" key={college._id}>
              <h3>{college.name}</h3>

              <p>
                <b>Location:</b> {college.location}
              </p>

              <p>
                <b>Fees:</b> ₹{college.fees}
              </p>

              <p>
                <b>Rating:</b> ⭐ {college.rating}
              </p>

              <p>
                <b>Placement:</b> {college.placement}
              </p>

              <p>
                <b>Courses:</b>{" "}
                {college.courses && college.courses.length > 0
                  ? college.courses.join(", ")
                  : "Not available"}
              </p>

              <div className="button-group">
                <button onClick={() => setDetails(college)}>
                  View Details
                </button>

                <button onClick={() => handleCompare(college)}>
                  {selected.find((c) => c._id === college._id)
                    ? "Remove"
                    : "Compare"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data">
            <h3>No colleges found</h3>
            <p>Click Reset or check backend API.</p>
          </div>
        )}
      </div>

      {/* Pagination Section */}
      {displayedColleges.length > collegesPerPage && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {details && (
        <div className="details">
          <h2>{details.name} Details</h2>

          <p>{details.description}</p>

          <p>
            <b>Location:</b> {details.location}
          </p>

          <p>
            <b>Fees:</b> ₹{details.fees}
          </p>

          <p>
            <b>Rating:</b> ⭐ {details.rating}
          </p>

          <p>
            <b>Placement:</b> {details.placement}
          </p>

          <p>
            <b>Courses:</b>{" "}
            {details.courses && details.courses.length > 0
              ? details.courses.join(", ")
              : "Not available"}
          </p>

          <button onClick={() => setDetails(null)}>Close</button>
        </div>
      )}

      {selected.length >= 2 && (
        <div className="compare">
          <h2>Compare Colleges</h2>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Fees</th>
                <th>Rating</th>
                <th>Placement</th>
              </tr>
            </thead>

            <tbody>
              {selected.map((college) => (
                <tr key={college._id}>
                  <td>{college.name}</td>
                  <td>{college.location}</td>
                  <td>₹{college.fees}</td>
                  <td>{college.rating}</td>
                  <td>{college.placement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <footer className="footer">
        <p>
          College Discovery Platform | Built with React, Node.js, Express and
          MongoDB
        </p>
      </footer>
    </div>
  );
}

export default App;