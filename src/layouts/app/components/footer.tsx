export const Footer = () => {
    const getFullYear = () => {
        return new Date().getFullYear();
    };

    return (
        <footer className="bg-sidebar text-sidebar-foreground text-xs p-2 border-t border-border">
            {/* Use sidebar colors for consistency or choose others */}
            <div className="container text-left px-4 md:px-6 font-medium leading-relaxed">
                &copy; {getFullYear()} Nexah SARL
                {/* Updated text to match screenshot */}
            </div>
        </footer>
    );
};
