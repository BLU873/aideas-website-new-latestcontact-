"use client";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { FaInstagram, FaLinkedin, FaEnvelope } from "react-icons/fa";

interface Member {
  id: number;
  name: string;
  designation: string;
  image: string;
  info: string;
  instagram?: string;
  linkedin?: string;
  email?: string;
}

const membersData: Member[] = [
  {
    id: 14,
    name: "Soham Muley",
    designation: "General Secretary",
    image: "/members/gs.png",
    info: "Leads the association and coordinates major activities.",
    instagram: "https://www.instagram.com/_sohammmmmm_?stkn=MW5xeXAxZHkwYzN1Mg%3D%3D&utm_source=qr",
    linkedin: "https://www.linkedin.com/in/soham-muley-44b81430a?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    email: "sohammuley1702@gmail.com",
  },
  {
    id: 13,
    name: "Saumya Raut",
    designation: "Joint General Secretary",
    image: "/members/jgs.png",
    info: "Leads key initiatives and actively contributes to the association’s growth.",
    instagram: "https://www.instagram.com/sau_meow_?stkn=MWE2Y3kxbnhhMG96eA==",
    linkedin: "https://www.linkedin.com/in/saumya-raut-98474a37b",
    email: "saumyaraut2006@gmail.com",
  },
  {
    id: 7,
    name: "Kartik Mitkar",
    designation: "Treasurer",
    image: "/members/treasurer.png",
    info: "Handles all finances and budget planning.",
    instagram: "https://www.instagram.com/kittu__0706?stkn=YWhmMDM0YzB0cDd1",
    linkedin: "https://www.linkedin.com/in/kartik-mitkar-14938a3b2?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    email: "kartikmitkar0706@gmail.com",
  },
  {
    id: 3,
    name: "Aditya Ajay Tilekar",
    designation: "Technical Head",
    image: "/members/tech-head-1.png",
    info: "Manages the website, apps, and technical events.",
    linkedin: "https://www.linkedin.com/in/aditya-tilekar-7b3614320?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    email: "adi06tilekar@gmail.com",
  },
  {
    id: 5,
    name: "Divya Chaudhari",
    designation: "Technical Head",
    image: "/members/tech-head-2.png",
    info: "Manages the website, apps, and technical events.",
    instagram: "https://www.instagram.com/__divya_chaudhari.6175__?stkn=MXY4eGhteWwzaWcxNA==",
    linkedin: "https://www.linkedin.com/in/divya-chaudhari-37b699327?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    email: "divyac6505@gmail.com",
  },
  {
    id: 11,
    name: "Saanidhi Gade",
    designation: "Technical Head",
    image: "/members/tech-head-3.png",
    info: "Manages the website, apps, and technical events.",
    instagram: "https://www.instagram.com/_.saanidhi._",
    linkedin: "https://www.linkedin.com/in/saanidhi-gade/",
    email: "gadesaanidhi@gmail.com",
  },
  {
    id: 10,
    name: "Pranali Wadghule",
    designation: "Event Management Head",
    image: "/members/event-management-head-1.png",
    info: "Plans and executes association events successfully.",
    instagram: "https://www.instagram.com/pranali_wadghule",
    linkedin: "https://www.linkedin.com/in/pranali-wadghule-9493b1316?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    email: "pranaliwadghule2006@gmail.com",
  },
  {
    id: 15,
    name: "Tushar Katre",
    designation: "Event Management Head",
    image: "/members/event-management-head-2.png",
    info: "Plans and executes association events successfully.",
    instagram: "https://www.instagram.com/_me_tus_har?stkn=MTY2ZXR2dHlwMTlrdQ==",
    linkedin: "https://www.linkedin.com/in/tushar-katre-3a5a65342?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    email: "tusharkatre215@gmail.com",
  },
  {
    id: 6,
    name: "Ganesh Rokade",
    designation: "Sponsorship & PR Head",
    image: "/members/sponsorship-pr-head.png",
    info: "Assists in sponsorship initiatives and outreach.",
    instagram: "https://www.instagram.com/justfree2006?stkn=NGhzdHNraXhyM2lw",
    linkedin: "https://www.linkedin.com/in/ganeshrokade06?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    email: "rokadeganesh701@gmail.com",
  },
  {
    id: 2,
    name: "Aarya Maynal",
    designation: "Design Head",
    image: "/members/design-head-1.png",
    info: "Designs visuals and graphics for events.",
    linkedin: "https://www.linkedin.com/in/aarya-m-23629829b?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    email: "aaryascientist1@gmail.com",
  },
  {
    id: 8,
    name: "Krish Yogesh Chobe",
    designation: "Design Head",
    image: "/members/design-head-2.png",
    info: "Designs visuals and graphics for events.",
    instagram: "https://www.instagram.com/krish_chobe?stkn=MXJhcDViZjlpbHBibg%3D%3D&utm_source=qr",
    linkedin: "https://www.linkedin.com/in/krish-chobe-761361368/",
    email: "krishchobe@gmail.com",
  },
  {
    id: 1,
    name: "Aariya Vora",
    designation: "Media & Marketing Head",
    image: "/members/media-marketing-head-1.png",
    info: "Handles media and marketing for the association.",
    instagram: "https://www.instagram.com/aariya_vora",
    linkedin: "https://www.linkedin.com/in/aariya-harshad-vora-6b8755312?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    email: "aariyavora@gmail.com",
  },
  {
    id: 4,
    name: "Aditya Krishnaswamy",
    designation: "Media & Marketing Head",
    image: "/members/media-marketing-head-2.png",
    info: "Handles media and marketing for the association.",
    instagram: "https://www.instagram.com/adityak._125/",
    linkedin: "https://www.linkedin.com/in/aditya-krishnaswamy-40b443340",
    email: "adityark1524@gmail.com",
  },
  {
    id: 9,
    name: "Omkar Mulage",
    designation: "Documentation & Editorial",
    image: "/members/documentation-editorial.png",
    info: "Creates and manages editorial and documentation content.",
    instagram: "https://www.instagram.com/omkarmulage_?stkn=bjU3cTN3NjVyNGNj",
    linkedin: "https://www.linkedin.com/in/omkar-mulage-708b77320?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    email: "omkarmulage9@gmail.com",
  },
  {
    id: 12,
    name: "Sarvadny Manish Pawar",
    designation: "Sports Secretary",
    image: "/members/sports-secretary.png",
    info: "Coordinates sports activities and events.",
    instagram: "https://www.instagram.com/sarvadny____sp?stkn=MWp5NDlhOGR5bG55Zg==",
    linkedin: "https://www.linkedin.com/in/sarvadny-pawar-229265373",
    email: "sarvadnypawar007@gmail.com",
  },
];

const MemberCard = ({ member, isMobile }: { member: Member; isMobile: boolean }) => {
  const controls = useAnimation();

  return (
    <motion.div
      key={member.id}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{
        opacity: 1,
        scale: 1,
      }}
      onViewportEnter={() => {
        if (isMobile) {
          controls.start({
            boxShadow: "0 0 20px #0ff",
            transition: { duration: 0.5 },
          });
        }
      }}
      onViewportLeave={() => {
        if (isMobile) {
          controls.start({
            boxShadow: "0 0 0px transparent",
            transition: { duration: 0.5 },
          });
        }
      }}
      animate={controls}
      viewport={{ amount: 0.3 }}
      transition={{ duration: 0.4 }}
      className="bg-black/60 border border-fuchsia-700 rounded-2xl overflow-hidden 
        md:shadow-none
        md:hover:scale-105 md:hover:border-cyan-400 md:hover:shadow-[0_0_20px_#0ff] 
        transition-all duration-300"
    >
      <Image
        src={member.image}
        alt={member.name}
        width={600}
        height={500}
        className="w-full h-110 p-4 object-cover"
      />
      <div className="p-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent hover:from-pink-500 hover:to-purple-400 transition-colors duration-300"
        >
          {member.name}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-lg text-fuchsia-400 font-medium hover:text-pink-500 transition-colors duration-300"
        >
          {member.designation}
        </motion.p>
        <p className="text-gray-300 mt-2 text-sm">{member.info}</p>

        {/* Social Icons */}
        <div className="flex justify-center gap-5 mt-3">
          {member.instagram && (
            <a
              href={member.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-300 transition-transform duration-300 hover:scale-125"
            >
              <FaInstagram size={25} />
            </a>
          )}
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-transform duration-300 hover:scale-125"
            >
              <FaLinkedin size={25} />
            </a>
          )}
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="text-gray-300 hover:text-gray-100 transition-transform duration-300 hover:scale-125"
            >
              <FaEnvelope size={25} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Members = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black via-purple-900 to-black py-10 overflow-hidden">
      {/* Starry Background */}
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px] animate-[moveStars_50s_linear_infinite]"></div>
        <style jsx>{`
          @keyframes moveStars {
            0% {
              background-position: 0 0;
            }
            100% {
              background-position: 1000px 1000px;
            }
          }
        `}</style>
      </div>

      <h1 className="relative z-10 text-5xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 drop-shadow-lg">
        Our Team
      </h1>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
        {membersData.map((member) => (
          <MemberCard key={member.id} member={member} isMobile={isMobile} />
        ))}
      </div>
    </div>
  );
};

export default Members;
