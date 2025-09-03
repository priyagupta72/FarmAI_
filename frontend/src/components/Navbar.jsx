// import { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FaHome,
//   FaCloudUploadAlt,
//   FaLeaf,
//   FaComments,
//   FaBars,
//   FaTimes,
//   FaSeedling, // ✅ Import FaSeedling
// } from "react-icons/fa";
// import { RiPlantFill } from "react-icons/ri";

// const Navbar = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const location = useLocation();

//   useEffect(() => {
//     setMenuOpen(false);
//   }, [location]);

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 50);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const navLinks = [
//     { path: "/", name: "Home", icon: FaHome },
//     { path: "/upload", name: "Disease Detection", icon: FaCloudUploadAlt },
//     { path: "/crop", name: "Crop Recommendation", icon: FaSeedling },
//     { path: "/fertilizer", name: "Fertilizer", icon: FaSeedling },
//     { path: "/diseases", name: "Encyclopedia", icon: FaLeaf },
//     // { path: "/forum", name: "Forum", icon: FaComments },
//   ];

//   return (
//     <>
//       <motion.header
//         initial={{ y: -100 }}
//         animate={{ y: 0 }}
//         transition={{ duration: 0.5 }}
//         className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
//           scrolled ? "bg-green-800 shadow-md" : "bg-green-700"
//         }`}
//       >
//         <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center h-12 sm:h-16">
//           {/* Logo */}
//           <Link to="/" className="flex items-center">
//             <motion.div whileHover={{ rotate: 15 }} className="text-2xl text-white mr-2">
//               <RiPlantFill />
//             </motion.div>
//             <span className="font-bold text-lg sm:text-xl text-white hidden sm:block">
//               FarmAI
//             </span>
//           </Link>

//           {/* Desktop Links */}
//           <nav className="hidden md:flex items-center space-x-3">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.path}
//                 to={link.path}
//                 className={`flex items-center justify-center px-4 py-2 rounded-full font-medium transition-all duration-300 ${
//                   location.pathname === link.path
//                     ? "bg-white text-green-700"
//                     : "text-white hover:bg-white hover:text-green-700"
//                 }`}
//               >
//                 <link.icon className="mr-2" />
//                 {link.name}
//               </Link>
//             ))}
//           </nav>

//           {/* Mobile Hamburger */}
//           <button
//             className="md:hidden text-2xl text-white p-2 rounded-full hover:bg-white hover:text-green-700 transition-colors"
//             onClick={() => setMenuOpen(!menuOpen)}
//             aria-label="Toggle menu"
//           >
//             {menuOpen ? <FaTimes /> : <FaBars />}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         <AnimatePresence>
//           {menuOpen && (
//             <motion.div
//               initial={{ opacity: 0, x: "-100%" }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: "-100%" }}
//               transition={{ type: "spring", damping: 25 }}
//               className="md:hidden fixed inset-0 bg-green-700 z-40 pt-16"
//             >
//               <div className="container mx-auto px-4 py-6 flex flex-col space-y-3">
//                 {navLinks.map((link) => (
//                   <Link
//                     key={link.path}
//                     to={link.path}
//                     onClick={() => setMenuOpen(false)}
//                     className={`flex items-center justify-center px-4 py-2 rounded-full font-medium transition-all duration-300 ${
//                       location.pathname === link.path
//                         ? "bg-white text-green-700"
//                         : "text-white hover:bg-white hover:text-green-700"
//                     }`}
//                   >
//                     <link.icon className="mr-2" />
//                     {link.name}
//                   </Link>
//                 ))}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.header>

//       {/* Spacer for fixed header */}
//       <div className="h-12 sm:h-16"></div>
//     </>
//   );
// };

// export default Navbar;










// import { useState, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FaHome,
//   FaCloudUploadAlt,
//   FaLeaf,
//   FaBars,
//   FaTimes,
//   FaSeedling,
//   FaSignInAlt,
//   FaUserPlus,
//   FaSignOutAlt,
// } from "react-icons/fa";
// import { RiPlantFill } from "react-icons/ri";

// const Navbar = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Close menu when navigating
//   useEffect(() => {
//     setMenuOpen(false);
//   }, [location]);

//   // Detect scroll
//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 50);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Check login status
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     setIsLoggedIn(!!token);
//   }, [location]);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setIsLoggedIn(false);
//     navigate("/login");
//   };

//   // Navigation links
//   const guestLinks = [
//     { path: "/login", name: "Sign In", icon: FaSignInAlt },
//     { path: "/register", name: "Register", icon: FaUserPlus },
//     { path: "/diseases", name: "Encyclopedia", icon: FaLeaf },
//   ];

//   const userLinks = [
//     { path: "/home", name: "Home", icon: FaHome },
//     { path: "/upload", name: "Disease Detection", icon: FaCloudUploadAlt },
//     { path: "/crop", name: "Crop Recommendation", icon: FaSeedling },
//     { path: "/fertilizer", name: "Fertilizer", icon: FaSeedling },
//     { path: "/diseases", name: "Encyclopedia", icon: FaLeaf },
//   ];

//   return (
//     <>
//       <motion.header
//         initial={{ y: -100 }}
//         animate={{ y: 0 }}
//         transition={{ duration: 0.5 }}
//         className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
//           scrolled ? "bg-green-800 shadow-md" : "bg-green-700"
//         }`}
//       >
//         <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center h-12 sm:h-16">
//           {/* Logo */}
//           <Link to="/home" className="flex items-center">
//             <motion.div whileHover={{ rotate: 15 }} className="text-2xl text-white mr-2">
//               <RiPlantFill />
//             </motion.div>
//             <span className="font-bold text-lg sm:text-xl text-white hidden sm:block">
//               FarmAI
//             </span>
//           </Link>

//           {/* Desktop Links */}
//           <nav className="hidden md:flex items-center space-x-3">
//             {(isLoggedIn ? userLinks : guestLinks).map((link) => (
//               <Link
//                 key={link.path}
//                 to={link.path}
//                 className={`flex items-center justify-center px-4 py-2 rounded-full font-medium transition-all duration-300 ${
//                   location.pathname === link.path
//                     ? "bg-white text-green-700"
//                     : "text-white hover:bg-white hover:text-green-700"
//                 }`}
//               >
//                 <link.icon className="mr-2" />
//                 {link.name}
//               </Link>
//             ))}

//             {/* Logout for logged in users */}
//             {isLoggedIn && (
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center justify-center px-4 py-2 rounded-full font-medium text-white hover:bg-white hover:text-green-700 transition-all duration-300"
//               >
//                 <FaSignOutAlt className="mr-2" />
//                 Logout
//               </button>
//             )}
//           </nav>

//           {/* Mobile Hamburger */}
//           <button
//             className="md:hidden text-2xl text-white p-2 rounded-full hover:bg-white hover:text-green-700 transition-colors"
//             onClick={() => setMenuOpen(!menuOpen)}
//             aria-label="Toggle menu"
//           >
//             {menuOpen ? <FaTimes /> : <FaBars />}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         <AnimatePresence>
//           {menuOpen && (
//             <motion.div
//               initial={{ opacity: 0, x: "-100%" }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: "-100%" }}
//               transition={{ type: "spring", damping: 25 }}
//               className="md:hidden fixed inset-0 bg-green-700 z-40 pt-16"
//             >
//               <div className="container mx-auto px-4 py-6 flex flex-col space-y-3">
//                 {(isLoggedIn ? userLinks : guestLinks).map((link) => (
//                   <Link
//                     key={link.path}
//                     to={link.path}
//                     onClick={() => setMenuOpen(false)}
//                     className={`flex items-center justify-center px-4 py-2 rounded-full font-medium transition-all duration-300 ${
//                       location.pathname === link.path
//                         ? "bg-white text-green-700"
//                         : "text-white hover:bg-white hover:text-green-700"
//                     }`}
//                   >
//                     <link.icon className="mr-2" />
//                     {link.name}
//                   </Link>
//                 ))}

//                 {/* Logout on mobile */}
//                 {isLoggedIn && (
//                   <button
//                     onClick={handleLogout}
//                     className="flex items-center justify-center px-4 py-2 rounded-full font-medium text-white hover:bg-white hover:text-green-700 transition-all duration-300"
//                   >
//                     <FaSignOutAlt className="mr-2" />
//                     Logout
//                   </button>
//                 )}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.header>

//       {/* Spacer for fixed header */}
//       <div className="h-12 sm:h-16"></div>
//     </>
//   );
// };

// export default Navbar; 












// import { useState, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FaHome,
//   FaCloudUploadAlt,
//   FaLeaf,
//   FaBars,
//   FaTimes,
//   FaSeedling,
//   FaSignInAlt,
//   FaUserPlus,
//   FaSignOutAlt,
// } from "react-icons/fa";
// import { RiPlantFill } from "react-icons/ri";

// const Navbar = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Close menu when navigating
//   useEffect(() => {
//     setMenuOpen(false);
//   }, [location]);

//   // Detect scroll
//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 50);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Check login status
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     setIsLoggedIn(!!token);
//   }, [location]);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setIsLoggedIn(false);
//     navigate("/login");
//   };

//   // Navigation links
//   const guestLinks = [
//     { path: "/login", name: "Sign In", icon: FaSignInAlt },
//     { path: "/register", name: "Register", icon: FaUserPlus },
//     { path: "/diseases", name: "Encyclopedia", icon: FaLeaf },
//   ];

//   const userLinks = [
//     { path: "/home", name: "Home", icon: FaHome },
//     { path: "/upload", name: "Disease Detection", icon: FaCloudUploadAlt },
//     { path: "/crop", name: "Crop Recommendation", icon: FaSeedling },
//     { path: "/fertilizer", name: "Fertilizer", icon: FaSeedling },
//     { path: "/diseases", name: "Encyclopedia", icon: FaLeaf },
//   ];

//   return (
//     <>
//       <motion.header
//         initial={{ y: -100 }}
//         animate={{ y: 0 }}
//         transition={{ duration: 0.5 }}
//         className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
//           scrolled ? "bg-green-800 shadow-md" : "bg-green-700"
//         }`}
//       >
//         <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center h-12 sm:h-16">
//           {/* Logo */}
//           <Link to="/home" className="flex items-center min-w-[100px]">
//             <motion.div
//               whileHover={{ rotate: 15 }}
//               className="text-2xl text-white mr-1 sm:mr-2"
//             >
//               <RiPlantFill />
//             </motion.div>
//             <span className="font-bold text-base sm:text-lg md:text-xl text-white">
//               FarmAI
//             </span>
//           </Link>

//           {/* Desktop Links */}
//           <nav className="hidden md:flex items-center space-x-2 lg:space-x-3">
//             {(isLoggedIn ? userLinks : guestLinks).map((link) => (
//               <Link
//                 key={link.path}
//                 to={link.path}
//                 className={`flex items-center px-3 py-2 rounded-full font-medium transition-all duration-300 whitespace-nowrap ${
//                   location.pathname === link.path
//                     ? "bg-white text-green-700"
//                     : "text-white hover:bg-white hover:text-green-700"
//                 }`}
//               >
//                 <link.icon className="mr-2" />
//                 {link.name}
//               </Link>
//             ))}

//             {/* Logout for logged in users */}
//             {isLoggedIn && (
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center px-3 py-2 rounded-full font-medium text-white hover:bg-white hover:text-green-700 transition-all duration-300 whitespace-nowrap"
//               >
//                 <FaSignOutAlt className="mr-2" />
//                 Logout
//               </button>
//             )}
//           </nav>

//           {/* Mobile Hamburger / Close */}
//           <button
//             className="md:hidden text-2xl text-white p-2 rounded-full hover:bg-white hover:text-green-700 transition-colors z-50 relative"
//             onClick={() => setMenuOpen(!menuOpen)}
//             aria-label="Toggle menu"
//           >
//             {menuOpen ? <FaTimes /> : <FaBars />}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         <AnimatePresence>
//           {menuOpen && (
//             <motion.div
//               initial={{ opacity: 0, x: "-100%" }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: "-100%" }}
//               transition={{ type: "spring", damping: 25 }}
//               className="md:hidden fixed inset-0 bg-green-700 z-40 pt-16 overflow-y-auto"
//             >
//               <div className="container mx-auto px-4 py-6 flex flex-col space-y-3">
//                 {(isLoggedIn ? userLinks : guestLinks).map((link) => (
//                   <Link
//                     key={link.path}
//                     to={link.path}
//                     onClick={() => setMenuOpen(false)}
//                     className={`flex items-center px-4 py-2 rounded-full font-medium text-base sm:text-lg transition-all duration-300 justify-start ${
//                       location.pathname === link.path
//                         ? "bg-white text-green-700"
//                         : "text-white hover:bg-white hover:text-green-700"
//                     }`}
//                   >
//                     <link.icon className="mr-2" />
//                     {link.name}
//                   </Link>
//                 ))}

//                 {/* Logout on mobile */}
//                 {isLoggedIn && (
//                   <button
//                     onClick={handleLogout}
//                     className="flex items-center px-4 py-2 rounded-full font-medium text-base sm:text-lg text-white hover:bg-white hover:text-green-700 transition-all duration-300 justify-start"
//                   >
//                     <FaSignOutAlt className="mr-2" />
//                     Logout
//                   </button>
//                 )}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.header>

//       {/* Spacer for fixed header */}
//       <div className="h-12 sm:h-16"></div>
//     </>
//   );
// };

// export default Navbar;










import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHome,
  FaCloudUploadAlt,
  FaLeaf,
  FaBars,
  FaTimes,
  FaSeedling,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
} from "react-icons/fa";
import { RiPlantFill } from "react-icons/ri";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close menu on navigation
  useEffect(() => setMenuOpen(false), [location]);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check login
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  const guestLinks = [
    { path: "/login", name: "Sign In", icon: FaSignInAlt },
    { path: "/register", name: "Register", icon: FaUserPlus },
    { path: "/diseases", name: "Encyclopedia", icon: FaLeaf },
  ];

  const userLinks = [
    { path: "/home", name: "Home", icon: FaHome },
    { path: "/upload", name: "Disease Detection", icon: FaCloudUploadAlt },
    { path: "/crop", name: "Crop Recommendation", icon: FaSeedling },
    { path: "/fertilizer", name: "Fertilizer", icon: FaSeedling },
    { path: "/diseases", name: "Encyclopedia", icon: FaLeaf },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-gradient-to-r from-green-700 to-emerald-600 shadow-lg"
            : "bg-gradient-to-r from-green-600 to-green-500"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link to="/home" className="flex items-center">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="text-3xl text-white mr-2"
            >
              <RiPlantFill />
            </motion.div>
            <span className="font-extrabold text-lg sm:text-xl md:text-2xl text-white">
              FarmAI
            </span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center space-x-3 lg:space-x-4">
            {(isLoggedIn ? userLinks : guestLinks).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-4 py-2 rounded-full font-medium text-sm sm:text-base transition-all duration-300 whitespace-nowrap ${
                  location.pathname === link.path
                    ? "bg-white text-green-700 shadow-md"
                    : "text-white hover:bg-white hover:text-green-700"
                }`}
              >
                <link.icon className="mr-2" />
                {link.name}
              </Link>
            ))}

            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 rounded-full font-medium text-sm sm:text-base text-white hover:bg-white hover:text-green-700 transition-all duration-300"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            )}
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-2xl text-white p-2 rounded-full hover:bg-white hover:text-green-700 transition-colors z-50 relative"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "-100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="md:hidden fixed inset-0 bg-gradient-to-b from-green-700 to-green-600 z-40 pt-20 overflow-y-auto"
            >
              <div className="container mx-auto px-6 flex flex-col space-y-4">
                {(isLoggedIn ? userLinks : guestLinks).map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-full font-medium text-base transition-all duration-300 ${
                      location.pathname === link.path
                        ? "bg-white text-green-700 shadow-md"
                        : "text-white hover:bg-white hover:text-green-700"
                    }`}
                  >
                    <link.icon className="mr-3" />
                    {link.name}
                  </Link>
                ))}

                {isLoggedIn && (
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-3 rounded-full font-medium text-base text-white hover:bg-white hover:text-green-700 transition-all duration-300"
                  >
                    <FaSignOutAlt className="mr-3" />
                    Logout
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer for fixed header */}
      <div className="h-16 sm:h-20"></div>
    </>
  );
};

export default Navbar;
