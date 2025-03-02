import React from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import YouTubeIcon from "@mui/icons-material/YouTube";
import GitHubIcon from "@mui/icons-material/GitHub";
import { Button } from "../ui/button";
import { activePalette, ColorPalette } from "@/lib/theme";

interface FooterProps {
  companyName?: string;
  companyLinks?: Array<{ label: string; href: string }>;
  resourceLinks?: Array<{ label: string; href: string }>;
  legalLinks?: Array<{ label: string; href: string }>;
  socialLinks?: Array<{ icon: React.ReactNode; href: string; label: string }>;
  palette?: ColorPalette;
}

const Footer = ({
  companyName = "Nexus",
  companyLinks = [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
    { label: "Press", href: "/press" },
  ],
  resourceLinks = [
    { label: "Blog", href: "/blog" },
    { label: "Community", href: "/community" },
    { label: "Support", href: "/support" },
    { label: "FAQs", href: "/faqs" },
  ],
  legalLinks = [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
  socialLinks = [
    {
      icon: <FacebookIcon sx={{ fontSize: 20 }} />,
      href: "https://facebook.com",
      label: "Facebook",
    },
    {
      icon: <TwitterIcon sx={{ fontSize: 20 }} />,
      href: "https://twitter.com",
      label: "Twitter",
    },
    {
      icon: <InstagramIcon sx={{ fontSize: 20 }} />,
      href: "https://instagram.com",
      label: "Instagram",
    },
    {
      icon: <SportsEsportsIcon sx={{ fontSize: 20 }} />,
      href: "https://twitch.tv",
      label: "Twitch",
    },
    {
      icon: <YouTubeIcon sx={{ fontSize: 20 }} />,
      href: "https://youtube.com",
      label: "YouTube",
    },
    {
      icon: <GitHubIcon sx={{ fontSize: 20 }} />,
      href: "https://github.com",
      label: "GitHub",
    },
  ],
  palette = activePalette,
}: FooterProps) => {
  return (
    <footer
      className={`w-full ${palette.background} ${palette.foreground} py-16 px-6 md:px-10`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">{companyName}</h3>
            <p className={`mb-4 ${palette.mutedForeground}`}>
              Connect with fellow gamers, join tournaments, and level up your
              gaming experience.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className={`${palette.mutedForeground} hover:${palette.primaryForeground} transition-colors duration-200`}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className={`${palette.mutedForeground} hover:${palette.primaryForeground} transition-colors duration-200`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {resourceLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className={`${palette.mutedForeground} hover:${palette.primaryForeground} transition-colors duration-200`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Join Our Newsletter</h3>
            <p className={`${palette.mutedForeground} mb-4`}>
              Stay updated with the latest gaming news and events.
            </p>
            <div className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className={`px-4 py-2 ${palette.secondary} rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
              />
              <Button
                className={`${palette.primary} ${palette.primaryHover} ${palette.primaryForeground}`}
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          className={`mt-12 pt-8 border-t ${palette.border} flex flex-col md:flex-row justify-between items-center`}
        >
          <p className={`${palette.mutedForeground} text-sm mb-4 md:mb-0`}>
            © {new Date().getFullYear()} {companyName}. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {legalLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className={`${palette.mutedForeground} text-sm hover:${palette.primaryForeground} transition-colors duration-200`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;