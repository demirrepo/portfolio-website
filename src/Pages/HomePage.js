import React, { useState, useEffect } from "react";
import { FaLinkedin, FaGithub, FaTelegram } from "react-icons/fa6";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { DiJavascript, DiPython } from "react-icons/di";
import "../styles/HomePage.css";
import Skills from "../components/Skills";
import Roadmap from "../components/Roadmap";
import Contact from "../components/Contact";

const tokenize = (line, language) => {
  const tokens = [];

  const addToken = (text, type) => {
    if (text) tokens.push({ text, type });
  };

  if (language === "js") {
    const keywords = ["const", "let", "var", "function", "return", "console"];
    const functions = ["log"];

    let remaining = line;
    let match;

    // Match comments first
    if (remaining.includes("//")) {
      const [code, comment] = remaining.split("//");
      remaining = code;
      if (comment) addToken("// " + comment, "comment");
    }

    // Match strings
    const stringRegex = /(['"`])(.*?)\1/g;
    while ((match = stringRegex.exec(remaining)) !== null) {
      const before = remaining.slice(0, match.index);
      if (before) {
        tokenizePart(before);
      }
      addToken(match[0], "string");
      remaining = remaining.slice(match.index + match[0].length);
    }
    if (remaining) {
      tokenizePart(remaining);
    }

    function tokenizePart(text) {
      const parts = text.split(/([{}[\],.:()=+\s])/);
      parts.forEach((part) => {
        if (!part.trim()) {
          addToken(part, "text");
        } else if (keywords.includes(part)) {
          addToken(part, "keyword");
        } else if (functions.includes(part)) {
          addToken(part, "function");
        } else if (part.match(/^[0-9]+$/)) {
          addToken(part, "number");
        } else if (part.match(/^[a-zA-Z]\w*(?=:)/)) {
          addToken(part, "property");
        } else if (part.match(/[{}[\],.:()=+]/)) {
          addToken(part, "punctuation");
        } else if (part.match(/^[a-zA-Z_]\w*$/)) {
          addToken(part, "variable");
        } else {
          addToken(part, "text");
        }
      });
    }
  } else {
    // Python tokenization
    const keywords = ["def", "class", "return", "print"];
    const remaining = line;

    // Match comments first
    if (remaining.includes("#")) {
      const [code, comment] = remaining.split("#");
      tokenizePart(code);
      if (comment) addToken("# " + comment, "comment");
    } else {
      tokenizePart(remaining);
    }

    function tokenizePart(text) {
      const parts = text.split(/([{}[\],.:()=+\s])/);
      parts.forEach((part) => {
        if (!part.trim()) {
          addToken(part, "text");
        } else if (keywords.includes(part)) {
          addToken(part, "keyword");
        } else if (part.match(/^[0-9]+$/)) {
          addToken(part, "number");
        } else if (part.match(/^'[^']*'$/)) {
          addToken(part, "string");
        } else if (part.match(/^[a-zA-Z]\w*(?=:)/)) {
          addToken(part, "property");
        } else if (part.match(/[{}[\],.:()=+]/)) {
          addToken(part, "punctuation");
        } else if (part.match(/^[a-zA-Z_]\w*$/)) {
          addToken(part, "variable");
        } else {
          addToken(part, "text");
        }
      });
    }
  }

  return tokens
    .map(({ text, type }) =>
      type === "text" ? text : `<span class="${type}">${text}</span>`
    )
    .join("");
};

// Utility function to split a name string by spaces
const splitName = (name) => {
  if (!name || typeof name !== "string") return [];
  return name.trim().split(/\s+/);
};

const jsCode = `// Code Editor Preview
const learningPath = {
    frontEnd: [
        'HTML',       'CSS',        'Tailwind',
        'JavaScript', 'React'
    ],
    backEnd: [
        'Node.js',    'Express.js',
        'MongoDB',    'Firebase'
    ],
    languages: ['Python', 'C++'],
    securityTool: 'Python'  // Recommended for security tasks
};

console.log("Learning Path:", learningPath);`;

const pyCode = `# Code Editor Preview
learning_path = {
    front_end: [
        'HTML',       'CSS',        'Tailwind',
        'JavaScript', 'React'
    ],
    back_end: [
        'Node.js',    'Express.js',
        'MongoDB',    'Firebase'
    ],
    languages: ['Python', 'C++'],
    security_tool: 'Python'  # Recommended for security tasks
}

print("Learning Path:", learning_path)`;

const HomePage = () => {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === null ? true : savedTheme === "dark";
  });
  const [activeTab, setActiveTab] = useState("js");
  const [isVisible, setIsVisible] = useState(false);
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [navOpen, setNavOpen] = useState(false);

  // Add scroll effect for nav
  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector("nav");
      if (window.scrollY > 20) {
        nav?.classList.add("scrolled");
      } else {
        nav?.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close nav on route change or link click
  useEffect(() => {
    const closeNav = () => setNavOpen(false);
    window.addEventListener("resize", closeNav);
    return () => window.removeEventListener("resize", closeNav);
  }, []);

  // Keyboard accessibility for hamburger
  const handleHamburgerKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      setNavOpen((prev) => !prev);
    }
  };

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://portfolio-jv2f.onrender.com/api/data/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: "Demir Razzaqov" }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data || !data.profile_data) {
          throw new Error("Invalid data format received from server");
        }

        setProfileData(data);
        setLoading(false);
      } catch (error) {
        console.error("Detailed fetch error:", error);
        setLoading(false);
        // Set an error state that we can show to the user
        setProfileData(null);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!profileData || !isVisible) return;

    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= profileData.profile_data.bio.length) {
        setTypedText(profileData.profile_data.bio.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [isVisible, profileData]);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light"
    );
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Always show About section
  useEffect(() => {
    setIsAboutVisible(true);
  }, []);

  const renderCodeContent = (code) => {
    const lines = code.split("\n");
    return (
      <>
        <div className="line-numbers">
          {lines.map((_, i) => (
            <span key={i}>{i + 1}</span>
          ))}
        </div>
        <div className="code-lines">
          {lines.map((line, i) => (
            <div
              key={i}
              className="code-line"
              dangerouslySetInnerHTML={{
                __html: line ? tokenize(line, activeTab) : "&nbsp;",
              }}
            />
          ))}
        </div>
      </>
    );
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  if (!profileData) {
    return (
      <div
        className="error"
        style={{
          padding: "20px",
          textAlign: "center",
          marginTop: "50px",
          color: "var(--text-color)",
        }}
      >
        <h2>Unable to load profile data</h2>
        <p>
          Please check your internet connection and try refreshing the page.
        </p>
        <p>
          If the problem persists, the server might be temporarily unavailable.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "10px 20px",
            marginTop: "20px",
            cursor: "pointer",
            background: "var(--accent-color)",
            border: "none",
            borderRadius: "5px",
            color: "white",
          }}
        >
          Refresh Page
        </button>
      </div>
    );
  }

  // Move name splitting logic here, after profileData is loaded
  const fullNameList = splitName(profileData.profile_data.name);
  const firstName = fullNameList[0];

  return (
    <div className={`HomePage ${isVisible ? "visible" : ""}`}>
      <div className="content-wrapper">
        <nav className={navOpen ? "scrolled" : ""}>
          <div className="nav-container">
            <div className="logo">
              <span>{profileData.profile_data.name}</span>
            </div>
            <div className="nav-right">
              {/* Hamburger icon for mobile */}
              <button
                className={`hamburger${navOpen ? " open" : ""}`}
                aria-label={
                  navOpen ? "Close navigation menu" : "Open navigation menu"
                }
                aria-expanded={navOpen}
                aria-controls="main-nav-links"
                tabIndex={0}
                onClick={() => setNavOpen((prev) => !prev)}
                onKeyDown={handleHamburgerKey}
              >
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
              </button>
              <div
                id="main-nav-links"
                className={`nav-links${navOpen ? " open" : ""}`}
                role="navigation"
              >
                <a href="#home" onClick={() => setNavOpen(false)}>
                  Home
                </a>
                <a href="#about" onClick={() => setNavOpen(false)}>
                  About
                </a>
                <a href="#skills" onClick={() => setNavOpen(false)}>
                  Skills
                </a>
                <a href="#roadmap" onClick={() => setNavOpen(false)}>
                  Roadmap
                </a>
                <a href="#contact" onClick={() => setNavOpen(false)}>
                  Contact
                </a>
                {/* iOS-style toggle for theme switcher in mobile nav */}
                <button
                  className={`theme-toggle nav-theme-toggle${
                    isDark ? " dark" : ""
                  }`}
                  onClick={() => setIsDark(!isDark)}
                  aria-label="Toggle theme"
                  style={{
                    marginTop: 24,
                    marginLeft: 0,
                    background: "none",
                    border: "none",
                    boxShadow: "none",
                    padding: 0,
                  }}
                >
                  <span className="toggle-bg"></span>
                  <span className="toggle-slider">
                    {isDark ? (
                      <span className="toggle-icon moon">&#9789;</span>
                    ) : (
                      <span className="toggle-icon sun">&#9728;</span>
                    )}
                  </span>
                </button>
              </div>
              {/* Theme toggle for desktop only */}
              <button
                className="theme-toggle desktop-theme-toggle"
                onClick={() => setIsDark(!isDark)}
                aria-label="Toggle theme"
                style={{ marginLeft: 12 }}
              >
                {isDark ? (
                  <SunIcon className="theme-icon" />
                ) : (
                  <MoonIcon className="theme-icon" />
                )}
              </button>
            </div>
          </div>
        </nav>
        <div id="home" className="main-content">
          <div className="hero-content">
            <div className="hello">&lt;Hello&gt;</div>
            <h1 className="name">
              I'm <span className="accent">{firstName}</span>
            </h1>
            <div className="role">
              I'm a{" "}
              <span className="accent">
                {"{" + profileData.profile_data.title + "}"}
              </span>
            </div>
            <p className="description">
              <span className="typing-text">{typedText}</span>
              <span className="cursor"></span>
            </p>

            <div className="social-links">
              <a
                href={profileData.profile_data.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub />
              </a>
              <a
                href={profileData.profile_data.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin />
              </a>
              <a
                href={`https://t.me/${profileData.profile_data.phone}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTelegram />
              </a>
            </div>

            <div className="buttons">
              <a href="#contact" className="btn btn-primary">
                Contact
              </a>
              <a
                href={`https://res.cloudinary.com/bnf404/${profileData.profile_data.resume}`}
                className="btn btn-secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download CV
              </a>
            </div>
          </div>

          <div className="code-section">
            <div className="code-preview">
              <div className="code-header">
                <div
                  className={`code-tab ${activeTab === "js" ? "active" : ""}`}
                  onClick={() => setActiveTab("js")}
                >
                  <DiJavascript className="language-icon js-icon" />
                  start.js
                </div>
                <div
                  className={`code-tab ${activeTab === "py" ? "active" : ""}`}
                  onClick={() => setActiveTab("py")}
                >
                  <DiPython className="language-icon py-icon" />
                  master.py
                </div>
              </div>
              <div className="code-content">
                {renderCodeContent(activeTab === "js" ? jsCode : pyCode)}
              </div>
            </div>
          </div>
        </div>{" "}
        <div
          className={`about-section${isAboutVisible ? " visible" : ""}`}
          id="about"
          data-visible={isAboutVisible}
        >
          <h2 className="section-title">
            <span className="angle-bracket">&lt;</span>
            About
            <span className="angle-bracket">&gt;</span>
          </h2>
          <div className="about-card">
            <div className="about-image-card">
              <div className="image-container">
                <img
                  src={`https://res.cloudinary.com/bnf404/${profileData.profile_data.profile_image}`}
                  alt="Profile"
                  className="profile-image"
                />
              </div>
            </div>
            <div className="about-content">
              <p className="about-text">
                {profileData.profile_data && profileData.profile_data.bio
                  ? profileData.profile_data.bio
                  : "No about text available."}
              </p>
              <div className="skills-categories">
                {profileData.skills_data &&
                profileData.skills_data.length > 0 ? (
                  profileData.skills_data.map((skill, idx) => (
                    <span key={skill.id} className="skill-item">
                      {skill.name}
                      {skill.level ? ` (${skill.level})` : ""}
                    </span>
                  ))
                ) : (
                  <span className="skill-item">No skills listed</span>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Skills Section - tech-grid dynamic from API */}
        {profileData.skills_data && profileData.skills_data.length > 0 && (
          <Skills
            techSkills={profileData.skills_data}
            language_data={profileData.language_data}
          />
        )}
        {/* Projects Section */}
        <div className="projects-section" id="projects">
          <h2 className="section-title">
            <span className="angle-bracket">&lt;</span>
            Projects
            <span className="angle-bracket">&gt;</span>
          </h2>
          <div className="projects-container">
            {profileData.projects_data.map((project) => (
              <div key={project.id} className="project-card">
                <div className="project-image">
                  <img
                    src={`https://res.cloudinary.com/bnf404/${project.image}`}
                    alt={project.title}
                  />
                </div>
                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-tech">{project.technologies}</div>
                  <div className="project-links">
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      Live Demo
                    </a>
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                    >
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Education Section */}
        <div className="education-section" id="education">
          <h2 className="section-title">
            <span className="angle-bracket">&lt;</span>
            Education
            <span className="angle-bracket">&gt;</span>
          </h2>
          <div className="education-container">
            {profileData.education_data.map((edu, index) => (
              <div
                key={edu.id}
                className="education-card"
                style={{ "--delay": index + 1 }}
              >
                <div className="education-content">
                  <span className="education-year">
                    {edu.start_year} - {edu.end_year || "Present"}
                  </span>
                  <h3>{edu.institution}</h3>
                  <p className="degree">
                    {edu.degree} in {edu.field_of_study}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Roadmap
          experienceData={profileData.experience_data}
          projectsData={profileData.projects_data}
        />
        <Contact profileData={profileData.profile_data} />
      </div>
    </div>
  );
};

export default HomePage;
