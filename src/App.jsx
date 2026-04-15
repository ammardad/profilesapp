import { useEffect, useMemo, useState } from "react";
import { Button } from "@aws-amplify/ui-react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import "./App.css";
import { generateClient } from "aws-amplify/data";
import { jsPDF } from "jspdf";
import outputs from "../amplify_outputs.json";
/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/
resource').Schema>}
 */
Amplify.configure(outputs);
const client = generateClient({
 authMode: "userPool",
});
export default function App() {
	const [userProfiles, setUserProfiles] = useState([]);
	const { signOut, user } = useAuthenticator((context) => [
		context.user,
		context.signOut,
	]);

	useEffect(() => {
		fetchUserProfile();
	}, []);

	async function fetchUserProfile() {
		const { data: profiles } = await client.models.UserProfile.list();
		setUserProfiles(profiles ?? []);
	}

	const profile = useMemo(() => {
		const primaryEmail =
			userProfiles[0]?.email ?? user?.signInDetails?.loginId ?? "you@example.com";

		return {
			name: "Ammar Dad",
			role: "Cloud Developer and Storytelling Builder",
			location: "Remote · Middle East",
			email: primaryEmail,
			summary:
				"I build human-first web apps on AWS, blending clean engineering with simple storytelling. My focus is creating products that feel warm, useful, and memorable.",
			highlights: [
				"8+ years in web and cloud product delivery",
				"AWS Amplify, React, GraphQL, and serverless architecture",
				"Mentoring teams and shipping polished user experiences",
			],
		};
	}, [userProfiles, user]);

	const journalEntries = [
		{
			date: "April 14, 2026",
			mood: "Focused",
			title: "Built a cleaner onboarding journey",
			text: "Reduced friction in first-time sign-in and made profile setup feel more personal.",
			tag: "Product",
		},
		{
			date: "April 12, 2026",
			mood: "Curious",
			title: "Learning from user interviews",
			text: "Users wanted simpler words, faster loading, and visible progress. Updated copy and flow.",
			tag: "Research",
		},
		{
			date: "April 09, 2026",
			mood: "Energized",
			title: "Reshaped dashboard visuals",
			text: "Introduced stronger typography and clearer information hierarchy for daily use.",
			tag: "Design",
		},
	];

	const experience = [
		{
			period: "2023 - Present",
			title: "Senior Full-Stack Engineer",
			org: "Independent and Client Projects",
			details:
				"Delivered cloud-native products with Amplify and React, improving performance and deployment reliability.",
		},
		{
			period: "2019 - 2023",
			title: "Frontend Lead",
			org: "Digital Product Studio",
			details:
				"Led UI architecture, design systems, and frontend quality standards across multiple teams.",
		},
		{
			period: "2016 - 2019",
			title: "Software Engineer",
			org: "Tech Consulting",
			details:
				"Built internal tools and client platforms with an emphasis on maintainability and developer velocity.",
		},
	];

	const skills = [
		"React",
		"AWS Amplify",
		"TypeScript",
		"GraphQL",
		"Node.js",
		"UI Architecture",
		"Product Thinking",
	];

	function downloadResumePdf() {
		const doc = new jsPDF({ unit: "pt", format: "a4" });
		const pageWidth = doc.internal.pageSize.getWidth();
		const pageHeight = doc.internal.pageSize.getHeight();
		const margin = 48;
		const maxWidth = pageWidth - margin * 2;
		let y = margin;

		const ensureSpace = (neededHeight = 22) => {
			if (y + neededHeight > pageHeight - margin) {
				doc.addPage();
				y = margin;
			}
		};

		const writeWrapped = (text, options = {}) => {
			const {
				fontSize = 11,
				lineHeight = 15,
				fontStyle = "normal",
				afterGap = 8,
			} = options;

			doc.setFont("helvetica", fontStyle);
			doc.setFontSize(fontSize);
			const lines = doc.splitTextToSize(text, maxWidth);
			ensureSpace(lines.length * lineHeight + afterGap);
			doc.text(lines, margin, y);
			y += lines.length * lineHeight + afterGap;
		};

		const sectionTitle = (title) => {
			ensureSpace(26);
			doc.setDrawColor(207, 61, 29);
			doc.setLineWidth(1.2);
			doc.line(margin, y + 4, margin + 70, y + 4);
			writeWrapped(title, {
				fontSize: 14,
				fontStyle: "bold",
				lineHeight: 16,
				afterGap: 10,
			});
		};

		writeWrapped(profile.name, {
			fontSize: 26,
			fontStyle: "bold",
			lineHeight: 30,
			afterGap: 6,
		});
		writeWrapped(`${profile.role}`, {
			fontSize: 12,
			fontStyle: "bold",
			afterGap: 12,
		});
		writeWrapped(`${profile.location} | ${profile.email}`, {
			fontSize: 10,
			afterGap: 14,
		});

		sectionTitle("Summary");
		writeWrapped(profile.summary, { fontSize: 11 });

		sectionTitle("Highlights");
		profile.highlights.forEach((item) => {
			writeWrapped(`- ${item}`, { fontSize: 11, afterGap: 5 });
		});
		y += 4;

		sectionTitle("Experience");
		experience.forEach((job) => {
			writeWrapped(`${job.title} | ${job.org}`, {
				fontSize: 12,
				fontStyle: "bold",
				afterGap: 3,
			});
			writeWrapped(job.period, { fontSize: 10, afterGap: 5 });
			writeWrapped(job.details, { fontSize: 11, afterGap: 10 });
		});

		sectionTitle("Skills");
		writeWrapped(skills.join(" | "), { fontSize: 11, afterGap: 14 });

		const generatedOn = new Date().toLocaleDateString();
		writeWrapped(`Generated on ${generatedOn}`, {
			fontSize: 9,
			afterGap: 0,
		});

		const filename = `${profile.name.replace(/\s+/g, "-").toLowerCase()}-resume.pdf`;
		doc.save(filename);
	}

	return (
		<main className="dashboard">
			<div className="ambient ambient-left" aria-hidden="true" />
			<div className="ambient ambient-right" aria-hidden="true" />

			<header className="hero panel reveal">
				<p className="eyebrow">Personal Hub</p>
				<h1>{profile.name}</h1>
				<p className="hero-role">{profile.role}</p>
				<p className="hero-summary">{profile.summary}</p>
				<div className="hero-meta">
					<span>{profile.location}</span>
					<span>{profile.email}</span>
				</div>
				<div className="hero-actions">
					<a href="#journal" className="ghost-btn">
						Read Journal
					</a>
					<a href="#resume" className="solid-btn">
						View Resume
					</a>
				</div>
			</header>

			<section id="profile" className="panel reveal">
				<h2>Personal Profile</h2>
				<ul className="highlight-list">
					{profile.highlights.map((item) => (
						<li key={item}>{item}</li>
					))}
				</ul>
			</section>

			<section id="journal" className="panel reveal">
				<div className="section-head">
					<h2>Personal Journal</h2>
					<p>Recent reflections from my build and learning journey.</p>
				</div>
				<div className="journal-grid">
					{journalEntries.map((entry) => (
						<article className="journal-card" key={entry.title}>
							<div className="journal-topline">
								<span>{entry.date}</span>
								<span>{entry.mood}</span>
							</div>
							<h3>{entry.title}</h3>
							<p>{entry.text}</p>
							<span className="tag">{entry.tag}</span>
						</article>
					))}
				</div>
			</section>

			<section id="resume" className="panel reveal">
				<div className="section-head">
					<h2>Resume</h2>
					<p>Experience, impact, and the skills I bring to product teams.</p>
				</div>
				<div className="resume-layout">
					<div className="timeline">
						{experience.map((job) => (
							<article className="timeline-item" key={job.title}>
								<p className="period">{job.period}</p>
								<h3>{job.title}</h3>
								<p className="org">{job.org}</p>
								<p>{job.details}</p>
							</article>
						))}
					</div>
					<aside className="skills-box">
						<h3>Core Skills</h3>
						<div className="skills-list">
							{skills.map((skill) => (
								<span key={skill} className="chip">
									{skill}
								</span>
							))}
						</div>
						<div className="resume-actions">
							<Button onClick={downloadResumePdf}>Download Resume PDF</Button>
							<Button variation="primary" onClick={signOut}>
								Sign Out
							</Button>
						</div>
					</aside>
				</div>
			</section>
		</main>
	);
}