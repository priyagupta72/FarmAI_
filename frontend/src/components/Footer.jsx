// const Footer = () => {
//   const quickLinks = [
//     { name: "Home", path: "/home" },
//     { name: "About Us", path: "/home" },
//     { name: "Disease Detection", path: "/upload" },
//     { name: "Crop Recommendation", path: "/crop" },
//     { name: "Fertilizer", path: "/fertilizer" },
//   ];

//   return (
//     <footer className="bg-gradient-to-t from-green-900 to-green-800 text-white py-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

//         {/* Top section: Brand + Quick Links */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-10 md:gap-0">
          
//           {/* Brand */}
//           <div className="space-y-3 md:max-w-sm">
//             <h2 className="text-3xl font-bold tracking-wider">FarmAI</h2>
//             <p className="text-green-200 text-sm sm:text-base leading-relaxed">
//               Empowering farmers with AI-driven crop disease detection.
//             </p>
//           </div>

//           {/* Quick Links */}
//           <div className="mt-6 md:mt-0">
//             <h4 className="text-lg font-semibold tracking-wider mb-3">Quick Links</h4>
//             <ul className="space-y-2 text-green-100 text-sm sm:text-base">
//               {quickLinks.map((link, idx) => (
//                 <li key={idx}>
//                   <a
//                     href={link.path}
//                     className="hover:text-yellow-400 transition-colors"
//                   >
//                     {link.name}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         {/* Bottom section: Copyright */}
//         <div className="mt-12 border-t border-green-700 pt-6 text-center text-green-300 text-sm sm:text-base">
//           © 2025 FarmAI. All rights reserved.
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;








import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token"); // check login status

  const quickLinks = [
    { name: "Home", path: "/home" },
    { name: "Encyclopedia", path: "/diseases" },
    { name: "Disease Detection", path: "/upload" },
    { name: "Crop Recommendation", path: "/crop" },
    { name: "Fertilizer", path: "/fertilizer" },
  ];

  const handleNavigation = (path) => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <footer className="bg-gradient-to-t from-green-900 to-green-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section: Brand + Quick Links */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-10 md:gap-0">
          {/* Brand */}
          <div className="space-y-3 md:max-w-sm">
            <h2 className="text-3xl font-bold tracking-wider">FarmAI</h2>
            <p className="text-green-200 text-sm sm:text-base leading-relaxed">
              Empowering farmers with AI-driven crop disease detection.
            </p>
          </div>

          {/* Quick Links */}
          <div className="mt-6 md:mt-0">
            <h4 className="text-lg font-semibold tracking-wider mb-3">Quick Links</h4>
            <ul className="space-y-2 text-green-100 text-sm sm:text-base">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleNavigation(link.path)}
                    className="hover:text-yellow-400 transition-colors text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section: Copyright */}
        <div className="mt-12 border-t border-green-700 pt-6 text-center text-green-300 text-sm sm:text-base">
          © 2025 FarmAI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
