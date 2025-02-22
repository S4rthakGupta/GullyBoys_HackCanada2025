import Image from "next/image";
import { FaLinkedin, FaGithub } from "react-icons/fa"; 
import { Separator } from "@/components/ui/separator"; 

const teamMembers = [
  {
    name: "Sarthak Gupta",
    role: "Frontend Developer",
    image: "/team/sarthak.png",
    linkedin: "https://www.linkedin.com/in/s4rthak-gupta", 
    github: "https://github.com/S4rthakGupta",
  },
  {
    name: "Bibin Tom Joseph",
    role: "Frontend Developer",
    image: "/team/bibin.png",
    linkedin: "https://www.linkedin.com/in/bibintomj/",
    github: "https://github.com/bibintomj",
  },
  {
    name: "Dheeraj Choudhary",
    role: "Backend Developer",
    image: "/team/dheeraj.png",
    linkedin: "https://www.linkedin.com/in/dheeraj-choudhary/",
    github: "#",
  },
  {
    name: "Jaiv Burman",
    role: "Backend Developer",
    image: "/team/jaiv.png",
    linkedin: "https://www.linkedin.com/in/jaiv-b-14450b139/",
    github: "https://github.com/JB250101",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 text-gray-900 pb-20">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-5xl font-extrabold text-blue-700 drop-shadow-lg">
          About MediQueue
        </h1>
        <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
          MediQueue is an innovative check-in system designed to streamline patient 
          flow in walk-in clinics. Our system reduces wait times, improves queue 
          management, and enhances the patient experience with real-time tracking.
        </p>
      </div>

      {/* Team Section */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-4xl font-semibold text-center text-gray-800 mb-10">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="relative group bg-white/80 p-6 rounded-xl shadow-xl 
              backdrop-blur-md border border-gray-200 hover:shadow-2xl 
              transition-all duration-300 transform hover:scale-105"
            >
              {/* Profile Image */}
              <div className="relative">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={150}
                  height={150}
                  className="rounded-full mx-auto border-4 border-blue-500 
                  shadow-md transition-all duration-300 group-hover:border-blue-400"
                />
                {/* Floating Glow Effect */}
                <div className="absolute inset-0 rounded-full border-4 border-blue-400 opacity-0 
                group-hover:opacity-100 transition duration-500 blur-lg"></div>
              </div>

              {/* Name & Role */}
              <h3 className="text-xl font-semibold mt-4 text-gray-900">
                {member.name}
              </h3>
              <p className="text-gray-600 text-md">{member.role}</p>

              {/* Social Media Links */}
              <div className="flex justify-center gap-4 mt-3">
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition"
                >
                  <FaLinkedin size={24} />
                </a>
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-gray-900 transition"
                >
                  <FaGithub size={24} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Separator at the End */}
      <Separator className="w-full my-10 bg-gray-700" />

      {/* Footer with Extra Spacing */}
      <footer className="text-center text-gray-500 text-sm pb-16">
        © {new Date().getFullYear()} MediQueue. All rights reserved.
      </footer>

    </div> 
  );
}
