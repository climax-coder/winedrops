import { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome
import "./App.css"; // Make sure your CSS contains the green and red highlight styles

function App() {
  const [data, setData] = useState([]); // Current data to display (filtered or unfiltered)
  const [allData, setAllData] = useState([]); // Initial unfiltered data
  const [searchTerm, setSearchTerm] = useState(""); // Search state
  const [highlight, setHighlight] = useState(false); // Track if highlighting is needed (for filtered data)

  const [isSortByRevenue, setIsSortByRevenue] = useState(false);
  const [isSortByBottles, setIsSortByBottles] = useState(false);
  const [isSortByOrders, setIsSortByOrders] = useState(false);
  
  // State to track the active button
  const [activeButton, setActiveButton] = useState(null);

  // Fetch All Data on initial render
  useEffect(() => {
    fetch("http://localhost:5001/AllData") // URL of your Fastify server
      .then((response) => response.json())
      .then((result) => {
        setData(result.data); // Set the default data to be displayed
        setAllData(result.data); // Store the initial full data for resetting
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Function to fetch Wine By Revenue on button click
  const fetchByRevenue = () => {
    fetch("http://localhost:5001/byRevenue") // URL of your Fastify server
      .then((response) => response.json())
      .then((result) => {
        setData(result.data); // Update data with revenue sorted data
        setHighlight(true); // Enable highlighting for filtered data
        setIsSortByRevenue(true);
        setIsSortByBottles(false);
        setIsSortByOrders(false);
        setActiveButton("revenue"); // Set active button to revenue
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  // Function to fetch By Bottles Sold on button click
  const fetchByBottles = () => {
    fetch("http://localhost:5001/byBottles") // URL of your Fastify server
      .then((response) => response.json())
      .then((result) => {
        setData(result.data); // Update data with bottles sold sorted data
        setHighlight(true); // Enable highlighting for filtered data
        setIsSortByRevenue(false);
        setIsSortByBottles(true);
        setIsSortByOrders(false);
        setActiveButton("bottles"); // Set active button to bottles
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  // Function to fetch By Orders on button click
  const fetchByOrders = () => {
    fetch("http://localhost:5001/byOrders") // URL of your Fastify server
      .then((response) => response.json())
      .then((result) => {
        setData(result.data); // Update data with orders sorted data
        setHighlight(true); // Enable highlighting for filtered data
        setIsSortByRevenue(false);
        setIsSortByBottles(false);
        setIsSortByOrders(true);
        setActiveButton("orders"); // Set active button to orders
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  // Filter data based on search term
  const filteredData = data.filter((item) =>
    item.wine_name_vintage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If highlighting is enabled (for filtered data), sort and highlight top/bottom 10%
  let sortedData = filteredData;
  let top10PercentIndex, bottom10PercentIndex;

  if (highlight) {
    // Sort data by revenue (or applicable filter criteria)
    sortedData = [...filteredData];

    // Calculate top 10% and bottom 10% indices
    top10PercentIndex = Math.ceil(sortedData.length * 0.1);
    bottom10PercentIndex = sortedData.length - top10PercentIndex;
  }

  return (
    <div>
      <div className="container">
        <h1 className="title">Best Selling Wine</h1>

        <span className="btn">
          <button
            className={`title_btn ${activeButton === "revenue" ? "active" : ""}`}
            onClick={fetchByRevenue}
          >
            By Revenue
          </button>
          <button
            className={`title_btn ${activeButton === "bottles" ? "active" : ""}`}
            onClick={fetchByBottles}
          >
            By # Bottles Sold
          </button>
          <button
            className={`title_btn ${activeButton === "orders" ? "active" : ""}`}
            onClick={fetchByOrders}
          >
            By # Orders
          </button>
        </span>

        <div className="search-section">
          <div className="input-container">
            <input
              className="search-text search-border"
              type="text"
              placeholder="Search for wine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search search-icon"></i> {/* Font Awesome search icon */}
          </div>
        </div>
      </div>

      {/* Display message if no search results found */}
      {filteredData.length === 0 ? (
        <div className="no-results-message">
          <p>No results found for your search. Please try a different keyword or check the spelling.</p>
        </div>
      ) : (
        // Ordered list with sequential numbering
        <ol className="global">
          {sortedData.map((item, index) => (
            <li
              key={index}
              className={
                highlight
                  ? index < top10PercentIndex
                    ? "green-highlight" // Apply green color for top 10%
                    : index >= bottom10PercentIndex
                    ? "red-highlight" // Apply red color for bottom 10%
                    : ""
                  : "" // No highlight for default unfiltered data
              }
            >
              {isSortByRevenue ? (
                <>
                  {item?.wine_name_vintage} - £{item?.total_amount.toFixed(2)}
                </>
              ) : isSortByBottles ? (
                <>
                  {item?.wine_name_vintage} - {item?.total_quantity}
                </>
              ) : isSortByOrders ? (
                <>
                  {item?.wine_name_vintage} - {item?.order_count}
                </>
              ) : (
                <>
                  {item?.wine_name_vintage}
                </>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default App;
