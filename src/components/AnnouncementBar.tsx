import { Link } from "react-router-dom";

interface AnnouncementBarProps {
  message: string;
  link?: string;
}

export const AnnouncementBar = ({ message, link }: AnnouncementBarProps) => {
  const content = (
    <span className="text-xs md:text-sm tracking-widest uppercase">{message}</span>
  );

  return (
    <div className="bg-foreground text-background py-3 text-center">
      {link ? (
        <Link to={link} className="hover:opacity-70 transition-opacity">
          {content}
        </Link>
      ) : (
        content
      )}
    </div>
  );
};