import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaLeaf,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const SEARCH_IMAGES = {
  default:
    "https://images.unsplash.com/photo-1743257165130-c514b979b91b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE5fHx8ZW58MHx8fHx8",
  rice: "https://images.unsplash.com/photo-1601342630318-5f4a6f4b6e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  wheat:
    "https://images.unsplash.com/photo-1558211246-bb8a7dfb2f9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  corn: "https://images.unsplash.com/photo-1601593768793-1e0d2290a1d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  tomato:
    "https://images.unsplash.com/photo-1594282418426-62d45b5e50c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  potato:
    "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  blight:
    "https://images.unsplash.com/photo-1586771107445-d3ca888129ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  rust: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
};

const FRONTEND_IMAGE_MAP = {
  "early blight":
    "https://www.gardeningknowhow.com/wp-content/uploads/2019/04/early-blight-1.jpg",
  "powdery mildew":
    "https://www.amgrow.com.au/wp-content/uploads/sites/4/2016/08/AdobeStock_86328428-800x600.jpeg",
  rust: "https://media.istockphoto.com/id/483451251/photo/fungal-attack.jpg?s=612x612&w=0&k=20&c=PM0Lld99Io4DU6sRqemkytZUkuSF5effOJ8fhIAXwVo=",
  "late blight":
    "https://cropaia.com/wp-content/uploads/Potato-blight-phytophthora-infestans.jpg",
  "downy mildew":
    "https://www.koppert.in/content/_processed_/c/6/csm_Plasmopara_viticola_1_a86cfd454e.jpeg",
  "fusarium wilt":
    "https://www.planetnatural.com/wp-content/uploads/2012/12/fusarium-wilt.jpg",
  "bacterial leaf spot":
    "https://cdn.mos.cms.futurecdn.net/mETEisEmPi2Hs4tCHiNs4M.jpg",
  anthracnose:
    "https://www.gardeningknowhow.com/wp-content/uploads/2021/05/anthracnose-disease.jpg",
  "root rot":
    "https://www.gardeningknowhow.com/wp-content/uploads/2021/09/root-rot-houseplant.jpg",
  "mosaic virus":
    "https://www.gardeningknowhow.com/wp-content/uploads/2020/04/mosaic-virus-tomato.jpg",
  "black sigatoka": "https://www.promusa.org/img/diseases/black-sigatoka.jpg",
  "rice blast":
    "https://www.irri.org/sites/default/files/Rice-blast-lesions.jpg",
};

const formatName = (name) => name.toLowerCase().trim().replace(/-/g, " ");

const DiseaseInfo = () => {
  const [diseases, setDiseases] = useState([]);
  const [filteredDiseases, setFilteredDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchImage, setSearchImage] = useState(SEARCH_IMAGES.default);
  const diseasesPerPage = 9;
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllDiseases();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    let newImage = SEARCH_IMAGES.default;

    if (query.includes("rice")) newImage = SEARCH_IMAGES.rice;
    else if (query.includes("wheat")) newImage = SEARCH_IMAGES.wheat;
    else if (query.includes("corn")) newImage = SEARCH_IMAGES.corn;
    else if (query.includes("tomato")) newImage = SEARCH_IMAGES.tomato;
    else if (query.includes("potato")) newImage = SEARCH_IMAGES.potato;
    else if (query.includes("blight")) newImage = SEARCH_IMAGES.blight;
    else if (query.includes("rust")) newImage = SEARCH_IMAGES.rust;

    setSearchImage(newImage);
  }, [searchQuery]);

  const fetchAllDiseases = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/diseases`);
      if (Array.isArray(res.data)) {
        setDiseases(res.data);
        setFilteredDiseases(res.data);
        setCurrentPage(1);
      } else {
        setError("Unexpected API response. Check the backend.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load disease information.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      fetchAllDiseases();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/diseases/search?query=${encodeURIComponent(searchQuery)}`,
      );
      if (Array.isArray(res.data)) {
        setFilteredDiseases(res.data);
        setCurrentPage(1);
      } else {
        setError("No diseases found for this search.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to search diseases.");
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastDisease = currentPage * diseasesPerPage;
  const indexOfFirstDisease = indexOfLastDisease - diseasesPerPage;
  const currentDiseases = filteredDiseases.slice(
    indexOfFirstDisease,
    indexOfLastDisease,
  );
  const totalPages = Math.ceil(filteredDiseases.length / diseasesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      {/* Hero Section */}
      <div
        className="h-72 md:h-96 w-full bg-cover bg-center flex items-center justify-center relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${searchImage})`,
        }}
      >
        <div className="text-center px-4 md:px-0 z-10">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
            Crop Disease Encyclopedia
          </h1>
          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Search diseases, crops, symptoms..."
              className="w-full rounded-full py-3 px-6 focus:outline-none focus:ring-4 focus:ring-green-400 text-gray-800 bg-green-50 shadow-md placeholder-gray-500 transition duration-300 hover:shadow-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 p-3 rounded-full text-white shadow-md hover:shadow-lg transition"
            >
              <FaSearch className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Disease Cards */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {loading && (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded">
            <div className="flex items-center gap-3">
              <FaLeaf className="h-6 w-6 text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentDiseases.map((disease) => {
            const diseaseKey = formatName(disease.name);
            const imageUrl =
              FRONTEND_IMAGE_MAP[diseaseKey] ||
              disease.imageUrl ||
              "https://placehold.co/600x400?text=plant+disease";

            return (
              <motion.div
                key={disease.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all"
              >
              
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-green-100 to-emerald-200">
  <img
    src={imageUrl}
    alt={disease.name}
    className="w-full h-full object-cover"
    loading="lazy"
    onError={(e) => {
      e.target.onerror = null;
      e.target.style.display = "none"; // hide broken img
      e.target.nextSibling.style.display = "flex"; // show fallback
    }}
  />
  {/* Fallback shown when image fails */}
  <div
    className="absolute inset-0 hidden flex-col items-center justify-center bg-gradient-to-br from-green-100 to-emerald-200"
  >
    <FaLeaf className="text-green-400 text-5xl mb-2" />
    <span className="text-green-700 font-semibold text-sm text-center px-4">{disease.name}</span>
  </div>
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
  <h3 className="absolute bottom-0 left-0 right-0 text-white font-bold text-xl p-4">
    {disease.name}
  </h3>
</div>
                <div className="p-6">
                  <h4 className="text-sm font-semibold text-green-600 uppercase tracking-wider mb-1">
                    Affected Crops
                  </h4>
                  <p className="text-gray-600 mb-4">
                    {disease.affectedCrops?.join(", ") || "Various crops"}
                  </p>

                  <h4 className="text-sm font-semibold text-green-600 uppercase tracking-wider mb-1">
                    Symptoms
                  </h4>
                  <p className="text-gray-600 line-clamp-3 mb-4">
                    {disease.symptoms}
                  </p>

                  {/* <button className="text-green-600 hover:text-green-800 font-medium text-sm flex items-center gap-1">
                    View full details
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    > */}

                  <button
                    onClick={() => navigate(`/diseases/${disease.id}`)}
                    className="text-green-600 hover:text-green-800 font-medium text-sm flex items-center gap-1 cursor-pointer"
                  >
                    View full details
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>

                  {/* <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                  </button> */}
                </div>
              </motion.div>
            );
          })}
        </div>

        {!loading && currentDiseases.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center mt-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <FaLeaf className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">
              No diseases found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {searchQuery
                ? "Try adjusting your search query"
                : "There are currently no diseases in our database"}
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-10 bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-700 mb-3 sm:mb-0">
              Showing{" "}
              <span className="font-medium">{indexOfFirstDisease + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastDisease, filteredDiseases.length)}
              </span>{" "}
              of <span className="font-medium">{filteredDiseases.length}</span>{" "}
              results
            </p>
            <div className="inline-flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md bg-green-50 text-green-600 font-medium hover:bg-green-100 disabled:opacity-50"
              >
                <FaChevronLeft />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-md font-medium ${
                      currentPage === page
                        ? "bg-green-600 text-white"
                        : "bg-green-50 text-green-600 hover:bg-green-100"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md bg-green-50 text-green-600 font-medium hover:bg-green-100 disabled:opacity-50"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseaseInfo;
