import React, { useEffect, useRef } from "react";
// import skillsData from "../data/skills.json";
// import {
//   FaHtml5,
//   FaCss3Alt,
//   FaJs,
//   FaReact,
//   FaNodeJs,
//   FaGithub,
//   FaFigma,
//   FaCode,
// } from "react-icons/fa";
// import { SiTailwindcss, SiMongodb, SiAdobexd } from "react-icons/si";
import "../styles/Skills.css";

// const iconMap = {
//   html5: FaHtml5,
//   css3: FaCss3Alt,
//   js: FaJs,
//   react: FaReact,
//   node: FaNodeJs,
//   tailwind: SiTailwindcss,
//   mongodb: SiMongodb,
//   github: FaGithub,
//   vscode: FaCode,
//   figma: FaFigma,
//   adobexd: SiAdobexd,
// };

const Skills = ({ techSkills, language_data }) => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const mainSkillsRef = useRef(null);
  const techGridRef = useRef(null);

  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === headerRef.current) {
            entry.target.classList.add("animate-in");
          } else if (entry.target === mainSkillsRef.current) {
            entry.target.classList.add("animate-in");
            const cards = entry.target.querySelectorAll(".skill-card");
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add("animate-in");
              }, index * 200);
            });
          } else if (entry.target === techGridRef.current) {
            const cards = entry.target.querySelectorAll(".skill-card");
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add("animate-in");
              }, index * 100);
            });
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.2,
      rootMargin: "0px",
    });

    if (headerRef.current) observer.observe(headerRef.current);
    if (mainSkillsRef.current) observer.observe(mainSkillsRef.current);
    if (techGridRef.current) observer.observe(techGridRef.current);

    return () => observer.disconnect();
  }, []);

  // Debugging: log the data used for rendering
  console.log("Main Skills (language_data):", language_data);
  console.log("Tech Grid (techSkills):", techSkills);

  return (
    <section className="skills-section" id="skills" ref={sectionRef}>
      <div className="skills-header" ref={headerRef}>
        <span className="tag">&lt;Skills&gt;</span>
        <h2>Skills and Proficiencies</h2>
        <p>Commanding Expertise in Digital Technologies and Tools</p>
      </div>

      {/* Main Skills Section - use language_data prop if available */}
      <div className="main-skills" ref={mainSkillsRef}>
        {Array.isArray(language_data) && language_data.length > 0 ? (
          language_data.map((skill, index) => (
            <div className="skill-card main" key={skill.id || index}>
              {skill.icon && skill.icon.includes("<svg") ? (
                <span
                  className="svg-wrapper"
                  dangerouslySetInnerHTML={{
                    __html: skill.icon.replace(
                      "<svg",
                      '<svg class="api-svg-icon"'
                    ),
                  }}
                />
              ) : (
                <span className="skill-icon-fallback">{skill.name[0]}</span>
              )}
              <span className="skill-name">{skill.name}</span>
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{
                    width: `${skill.progress || 0}%`,
                    backgroundColor: skill.color || "#4ade80",
                  }}
                >
                  <span className="progress-text">{skill.progress || 0}%</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <span className="no-skills">No main skills found.</span>
        )}
      </div>

      {/* Tech Grid Section - use techSkills array */}
      <div className="tech-grid" ref={techGridRef}>
        {Array.isArray(techSkills) && techSkills.length > 0
          ? techSkills.map((tech, index) => (
              <div className="skill-card" key={tech.id || index}>
                <div className="skill-icon">
                  {tech.icon && tech.icon.includes("<svg") ? (
                    <span
                      className="svg-wrapper"
                      dangerouslySetInnerHTML={{
                        __html: tech.icon.replace(
                          "<svg",
                          '<svg class="api-svg-icon"'
                        ),
                      }}
                    />
                  ) : (
                    <span>{tech.name[0]}</span>
                  )}
                </div>
                <h3>{tech.name}</h3>
                {tech.description && <p>{tech.description}</p>}
              </div>
            ))
          : null}
      </div>
    </section>
  );
};

export default Skills;
